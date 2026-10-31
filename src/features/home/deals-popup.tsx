"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { dealsTitleKey } from "@/lib/cms/deals-copy";
import { useEditing } from "@/lib/cms/use-cms";
import { DealsSignup } from "./deals-signup";
import styles from "./deals-signup.module.css";

const STORAGE_KEY = "primefix-deals-popup";
const DELAY_MS = 40_000;

function alreadyShown() {
	try {
		return window.sessionStorage.getItem(STORAGE_KEY) === "shown";
	} catch {
		return false;
	}
}

function markShown() {
	try {
		window.sessionStorage.setItem(STORAGE_KEY, "shown");
	} catch {
		void 0;
	}
}

export function DealsPopup() {
	const pathname = usePathname();
	const editing = useEditing();
	const headingId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const admin = pathname.startsWith("/admin");

	useEffect(() => {
		if (admin || alreadyShown()) return;
		const timer = window.setTimeout(() => {
			markShown();
			setOpen(true);
		}, DELAY_MS);
		return () => window.clearTimeout(timer);
	}, [admin]);

	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	if (!open || admin || editing) return null;

	return (
		<div className={styles.backdrop}>
			<button type="button" className={styles.dismiss} aria-label="Close sign up form" onClick={() => setOpen(false)} />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={headingId}
				tabIndex={-1}
				className={styles.dialog}
			>
				<DealsSignup
					id="deals-popup"
					titleKey={dealsTitleKey(pathname)}
					headingId={headingId}
					popup
					onClose={() => setOpen(false)}
				/>
			</div>
		</div>
	);
}
