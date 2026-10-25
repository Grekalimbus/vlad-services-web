"use client";

import { useCms } from "@/lib/cms/use-cms";
import { ConsentFields } from "@/features/quote";
import { emailPattern, phonePattern, zipPattern } from "@/lib/forms";
import { buildLeadPayload, submitLead } from "@/lib/leads";
import { FormEvent, useId, useState } from "react";
import styles from "./deals-signup.module.css";

type Status = "idle" | "loading" | "success" | "error";

export function DealsSignup() {
	const ids = {
		name: useId(),
		phone: useId(),
		zip: useId(),
		email: useId(),
		error: useId(),
	};
	const copy = useCms().copy.home.deals;
	const [status, setStatus] = useState<Status>("idle");
	const [errors, setErrors] = useState<Record<string, string>>({});

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const name = String(data.get("name") ?? "").trim();
		const phone = String(data.get("phone") ?? "").trim();
		const zip = String(data.get("zip") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const nextErrors: Record<string, string> = {};

		if (name.length < 2) nextErrors.name = "Enter your name.";
		if (!phonePattern.test(phone)) nextErrors.phone = "Enter a phone number.";
		if (zip && !zipPattern.test(zip)) nextErrors.zip = "Enter a 5-digit ZIP code.";
		if (email && !emailPattern.test(email))
			nextErrors.email = "Enter a valid email.";
		if (data.get("smsConsent") !== "yes") nextErrors.sms = "Required";
		if (data.get("emailConsent") !== "yes") nextErrors.emailConsent = "Required";

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			setStatus("error");
			document.getElementById(ids.error)?.focus();
			return;
		}

		setStatus("loading");
		await submitLead(
			buildLeadPayload({
				type: "deals",
				formId: "deals-signup",
				fields: { name, phone, zip, email },
				photos: [],
				smsConsent: data.get("smsConsent") === "yes",
				emailConsent: data.get("emailConsent") === "yes",
			}),
		);
		form.reset();
		setStatus("success");
	}

	return (
		<section
			id="deals"
			aria-labelledby="deals-heading"
			className={styles.section}
		>
			<div className={styles.container}>
				<div className={styles.panel}>
					<div className={styles.photo} aria-hidden="true" />
					<div className={styles.content}>
						<h2 id="deals-heading" className={styles.heading}>
							<span data-cms="copy.home.deals.headingLead">{copy.headingLead}</span>{" "}
							<span className={styles.accent} data-cms="copy.home.deals.headingAccent">{copy.headingAccent}</span>
						</h2>
						{status === "success" ? (
							<p role="status" className={styles.success}>
								<span data-cms="copy.home.deals.success">{copy.success}</span>
							</p>
						) : (
							<form
								onSubmit={onSubmit}
								noValidate
								className={styles.form}
								onChange={(event) => {
									const data = new FormData(event.currentTarget);
									setErrors((current) => clearFixedErrors(current, data));
								}}
							>
								{status === "error" && Object.keys(errors).length > 0 ? (
									<p
										id={ids.error}
										tabIndex={-1}
										role="alert"
										className={styles.formError}
									>
										<span data-cms="copy.home.deals.error">{copy.error}</span>
									</p>
								) : null}
								<div className={styles.grid}>
									<DealField
										id={ids.name}
										name="name"
										label={copy.nameLabel}
										cms="copy.home.deals.nameLabel"
										autoComplete="name"
										placeholder={copy.namePlaceholder}
										error={errors.name}
									/>
									<DealField
										id={ids.phone}
										name="phone"
										label={copy.phoneLabel}
										cms="copy.home.deals.phoneLabel"
										type="tel"
										autoComplete="tel"
										placeholder={copy.phonePlaceholder}
										error={errors.phone}
									/>
									<DealField
										id={ids.zip}
										name="zip"
										label={copy.zipLabel}
										cms="copy.home.deals.zipLabel"
										inputMode="numeric"
										autoComplete="postal-code"
										placeholder={copy.zipPlaceholder}
										error={errors.zip}
									/>
									<DealField
										id={ids.email}
										name="email"
										label={copy.emailLabel}
										cms="copy.home.deals.emailLabel"
										type="email"
										autoComplete="email"
										placeholder={copy.emailPlaceholder}
										error={errors.email}
									/>
								</div>
								<div className={styles.consentWrap}>
									<ConsentFields
										tone="inverse"
										invalidSms={Boolean(errors.sms)}
										invalidEmail={Boolean(errors.emailConsent)}
									/>
								</div>
								<button
									type="submit"
									disabled={status === "loading"}
									className={styles.submit}
								>
									<span data-cms={status === "loading" ? "copy.home.deals.sending" : "copy.home.deals.submit"}>
									{status === "loading" ? copy.sending : copy.submit}
								</span>
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function clearFixedErrors(current: Record<string, string>, data: FormData) {
	if (Object.keys(current).length === 0) return current;
	const next = { ...current };
	const name = String(data.get("name") ?? "").trim();
	const phone = String(data.get("phone") ?? "").trim();
	const zip = String(data.get("zip") ?? "").trim();
	const email = String(data.get("email") ?? "").trim();
	if (name.length >= 2) delete next.name;
	if (phonePattern.test(phone)) delete next.phone;
	if (!zip || zipPattern.test(zip)) delete next.zip;
	if (!email || emailPattern.test(email)) delete next.email;
	if (data.get("smsConsent") === "yes") delete next.sms;
	if (data.get("emailConsent") === "yes") delete next.emailConsent;
	return next;
}

function DealField({
	id,
	name,
	label,
	cms,
	type = "text",
	autoComplete,
	inputMode,
	placeholder,
	error,
}: {
	id: string;
	name: string;
	label: string;
	cms: string;
	type?: string;
	autoComplete?: string;
	inputMode?: "numeric";
	placeholder: string;
	error?: string;
}) {
	return (
		<div className={styles.field}>
			<label htmlFor={id} className={styles.label}>
				<span data-cms={cms}>{label}</span>
			</label>
			<input
				id={id}
				name={name}
				type={type}
				autoComplete={autoComplete}
				inputMode={inputMode}
				placeholder={placeholder}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${id}-error` : undefined}
				className={error ? `${styles.input} ${styles.inputInvalid}` : styles.input}
			/>
			{error ? (
				<p id={`${id}-error`} className={styles.error}>
					{error}
				</p>
			) : null}
		</div>
	);
}
