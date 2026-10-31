"use client";

import { ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { planOffers } from "@/lib/cms/tv-page";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { hearAboutOptions } from "@/lib/hear-about";
import { buildLeadPayload, submitLead } from "@/lib/leads";
import { nationalDigits, useUsPhone } from "@/lib/use-us-phone";
import shared from "@/styles/shared.module.css";
import styles from "./tv-discount-dialog.module.css";

type Status = "idle" | "loading" | "success" | "error";

export function TvDiscountDialog({ id, onClose }: { id: "2" | "3" | "4plus"; onClose: () => void }) {
	const cms = useCms();
	const editing = useEditing();
	const offer = planOffers(cms)[id];
	const titleId = useId();
	const nameId = useId();
	const phoneId = useId();
	const hearId = useId();
	const errorId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);
	const phoneField = useUsPhone();
	const [mounted, setMounted] = useState(false);
	const [status, setStatus] = useState<Status>("idle");
	const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
	const [formError, setFormError] = useState("");
	const [hearAbout, setHearAbout] = useState("");

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (editing) return;
		const form = event.currentTarget;
		const data = new FormData(form);
		const name = String(data.get("name") ?? "").trim();
		const next: { name?: string; phone?: string } = {};
		if (name.length < 2) next.name = "Enter your name.";
		if (nationalDigits(phoneField.phone).length !== 10) next.phone = "Enter a phone number.";
		setErrors(next);
		setFormError("");
		if (Object.keys(next).length > 0) {
			setStatus("error");
			document.getElementById(errorId)?.focus();
			return;
		}

		setStatus("loading");
		try {
			await submitLead(
				buildLeadPayload({
					type: "tv-mounting",
					formId: "tv-discount",
					fields: {
						name,
						phone: phoneField.phone,
						tvCount: id,
						offer: offer.title,
						service: offer.title,
						...(hearAbout ? { hearAbout } : {}),
					},
					photos: [],
					smsConsent: false,
					emailConsent: false,
				}),
			);
			setStatus("success");
		} catch (error) {
			setStatus("error");
			setFormError(error instanceof Error ? error.message : "Could not send the request.");
			document.getElementById(errorId)?.focus();
		}
	}

	function onPhoneChange(event: ChangeEvent<HTMLInputElement>) {
		const count = phoneField.onPhoneChange(event);
		if (errors.phone && count === 10) setErrors((current) => ({ ...current, phone: undefined }));
	}

	if (!mounted) return null;

	return createPortal(
		<div className={styles.backdrop}>
			<button type="button" className={styles.dismiss} aria-label="Close discount form" onClick={onClose} />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				data-cms-surface={`tv-offer:${id}`}
				className={styles.dialog}
			>
				<button type="button" className={styles.close} onClick={onClose}>
					<X size={18} aria-hidden="true" />
					<span className={shared.visuallyHidden}>Close</span>
				</button>
				<h2 id={titleId} className={styles.title} data-cms={`copy.plan.offers.${id}.title`}>
					{withPercent(offer.title, styles.percent)}
				</h2>
				<p className={styles.subtitle} data-cms={`copy.plan.offers.${id}.subtitle`}>
					{offer.subtitle}
				</p>
				{status === "success" ? null : (
					<form className={styles.form} noValidate onSubmit={onSubmit}>
						{status === "error" ? (
							<p id={errorId} tabIndex={-1} role="alert" className={styles.alert}>
								{formError || "Check your name and phone number."}
							</p>
						) : null}
						<div className={styles.field}>
							<label className={shared.visuallyHidden} htmlFor={nameId}>
								Your name
							</label>
							<input
								id={nameId}
								name="name"
								autoComplete="name"
								placeholder="Your name"
								className={errors.name ? `${styles.input} ${styles.inputInvalid}` : styles.input}
								aria-invalid={errors.name ? true : undefined}
							/>
							{errors.name ? <p className={styles.error}>{errors.name}</p> : null}
						</div>
						<div className={styles.field}>
							<label className={shared.visuallyHidden} htmlFor={phoneId}>
								Phone
							</label>
							<input
								ref={phoneField.phoneRef}
								id={phoneId}
								name="phone"
								type="tel"
								inputMode="numeric"
								autoComplete="tel"
								placeholder="+1 (___) ___-____"
								value={phoneField.phone}
								onChange={onPhoneChange}
								onBeforeInput={phoneField.onBeforeInput}
								className={errors.phone ? `${styles.input} ${styles.inputInvalid}` : styles.input}
								aria-invalid={errors.phone ? true : undefined}
							/>
							{errors.phone ? <p className={styles.error}>{errors.phone}</p> : null}
						</div>
						<div className={styles.field}>
							<label className={shared.visuallyHidden} htmlFor={hearId}>
								How did you hear about us?
							</label>
							<select
								id={hearId}
								name="hearAbout"
								value={hearAbout}
								onChange={(event) => setHearAbout(event.target.value)}
								className={hearAbout ? styles.select : `${styles.select} ${styles.selectEmpty}`}
							>
								<option value="">How did you hear about us?</option>
								{hearAboutOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
						<button type="submit" className={styles.submit} disabled={status === "loading"}>
							<span data-cms={`copy.plan.offers.${id}.button`}>
								{status === "loading" ? "Sending…" : offer.button}
							</span>
						</button>
					</form>
				)}
				<p className={styles.note} role={status === "success" ? "status" : undefined} data-cms={`copy.plan.offers.${id}.note`}>
					{offer.note}
				</p>
			</div>
		</div>,
		document.body,
	);
}

function withPercent(text: string, className: string) {
	const match = text.match(/\d+\s*%/);
	if (!match || match.index == null) return text;
	const start = match.index;
	const end = start + match[0].length;
	return (
		<>
			{text.slice(0, start)}
			<span className={className}>{match[0]}</span>
			{text.slice(end)}
		</>
	);
}
