"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

/** Digits the user typed. The mask's own "+1" is not part of the number. */
export function nationalDigits(value: string) {
	const digits = value.replace(/\D/g, "");
	if (!digits) return "";
	if (value.trimStart().startsWith("+")) return digits.startsWith("1") ? digits.slice(1) : digits;
	if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
	return digits;
}

export function formatUsPhone(digits: string) {
	// Keep free-form digits when longer than a standard US local number.
	if (digits.length > 10) return digits;
	const area = digits.slice(0, 3);
	const prefix = digits.slice(3, 6);
	const line = digits.slice(6, 10);
	if (!area) return "";
	if (digits.length < 3) return `+1 (${area}`;
	if (digits.length === 3) return `+1 (${area})`;
	if (digits.length < 7) return `+1 (${area}) ${prefix}`;
	return `+1 (${area}) ${prefix}-${line}`;
}

function caretForDigits(formatted: string, count: number) {
	if (count <= 0) return formatted.startsWith("+1") ? 4 : 0;
	let seen = 0;
	for (let index = 0; index < formatted.length; index += 1) {
		if (/\d/.test(formatted[index] ?? "")) {
			const isCountry = formatted.startsWith("+1") && index < 2;
			if (!isCountry) seen += 1;
			if (seen >= count) return index + 1;
		}
	}
	return formatted.length;
}

export function applyPhoneEdit(previousFormatted: string, raw: string, caret: number) {
	const previous = nationalDigits(previousFormatted);
	let nextDigits = nationalDigits(raw);
	let digitsBefore = nationalDigits(raw.slice(0, Math.max(0, caret))).length;

	// Backspace landed on a mask character, so the digits did not change.
	// Remove the user digit just before the caret instead of keeping it stuck.
	if (nextDigits === previous && raw.length < previousFormatted.length && previous.length > 0) {
		const before = nationalDigits(previousFormatted.slice(0, Math.max(0, caret))).length;
		if (before > 0) {
			const removeAt = before - 1;
			nextDigits = previous.slice(0, removeAt) + previous.slice(removeAt + 1);
			digitsBefore = removeAt;
		}
	}

	const value = formatUsPhone(nextDigits);
	return { value, caret: caretForDigits(value, digitsBefore), count: nextDigits.length };
}

export function useUsPhone() {
	const [phone, setPhone] = useState("");
	const phoneRef = useRef<HTMLInputElement>(null);
	const phoneCaret = useRef<number | null>(null);

	useEffect(() => {
		const input = phoneRef.current;
		const caret = phoneCaret.current;
		if (!input || caret == null || document.activeElement !== input) return;
		input.setSelectionRange(caret, caret);
		phoneCaret.current = null;
	}, [phone]);

	function onPhoneChange(event: ChangeEvent<HTMLInputElement>) {
		const input = event.target;
		const edit = applyPhoneEdit(phone, input.value, input.selectionStart ?? input.value.length);
		phoneCaret.current = edit.caret;
		if (edit.value === phone) {
			input.value = edit.value;
			input.setSelectionRange(edit.caret, edit.caret);
			return edit.count;
		}
		setPhone(edit.value);
		return edit.count;
	}

	function onBeforeInput(event: FormEvent<HTMLInputElement>) {
		const data = (event.nativeEvent as InputEvent).data;
		if (data && data.length === 1 && /\D/.test(data)) event.preventDefault();
	}

	return { phone, phoneRef, onPhoneChange, onBeforeInput };
}
