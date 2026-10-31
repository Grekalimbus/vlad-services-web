"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export function nationalDigits(value: string, previous = "") {
	let digits = value.replace(/\D/g, "");
	const hadCountry = previous.startsWith("+1") || value.trim().startsWith("+");
	if ((hadCountry || digits.length > 10) && digits.startsWith("1")) digits = digits.slice(1);
	return digits.slice(0, 10);
}

export function formatUsPhone(digits: string) {
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
		if (/\d/.test(formatted[index])) {
			const isCountry = index < 2;
			if (!isCountry) seen += 1;
			if (seen >= count) return index + 1;
		}
	}
	return formatted.length;
}

export function useUsPhone() {
	const [phone, setPhone] = useState("");
	const phoneRef = useRef<HTMLInputElement>(null);
	const phoneCaret = useRef<number | null>(null);

	useEffect(() => {
		const input = phoneRef.current;
		const caret = phoneCaret.current;
		if (!input || caret == null) return;
		input.setSelectionRange(caret, caret);
		phoneCaret.current = null;
	}, [phone]);

	function onPhoneChange(event: ChangeEvent<HTMLInputElement>) {
		const input = event.target;
		const caret = input.selectionStart ?? input.value.length;
		const previousDigits = nationalDigits(phone);
		let nextDigits = nationalDigits(input.value, phone);
		const removedFormatting = nextDigits === previousDigits && input.value.length < phone.length;
		if (removedFormatting) nextDigits = previousDigits.slice(0, -1);
		const digitsBefore = removedFormatting
			? nextDigits.length
			: nationalDigits(input.value.slice(0, caret), phone).length;
		const next = formatUsPhone(nextDigits);
		phoneCaret.current = caretForDigits(next, digitsBefore);
		setPhone(next);
		return nextDigits.length;
	}

	function onBeforeInput(event: FormEvent<HTMLInputElement>) {
		const data = (event.nativeEvent as InputEvent).data;
		if (data && data.length === 1 && /\D/.test(data)) event.preventDefault();
	}

	return { phone, phoneRef, onPhoneChange, onBeforeInput };
}
