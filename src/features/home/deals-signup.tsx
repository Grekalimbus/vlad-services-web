"use client";

import { useCms } from "@/lib/cms/use-cms";
import { ConsentFields } from "@/features/quote";
import { emailPattern, phonePattern, zipPattern } from "@/lib/forms";
import { buildLeadPayload, submitLead } from "@/lib/leads";
import { FormEvent, useId, useState } from "react";
import styles from "./deals-signup.module.css";

type Status = "idle" | "loading" | "success" | "error";

export function DealsSignup({ id = "deals" }: { id?: string }) {
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
		if (!zipPattern.test(zip)) nextErrors.zip = "Enter a 5-digit ZIP code.";
		if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email.";
		if (data.get("smsConsent") !== "yes") nextErrors.sms = "Required";
		if (data.get("emailConsent") !== "yes") nextErrors.emailConsent = "Required";

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			setStatus("error");
			document.getElementById(ids.error)?.focus();
			return;
		}

		setStatus("loading");
		try {
			await submitLead(
				buildLeadPayload({
					type: "deals",
					formId: "deals-signup",
					fields: { name, phone, zip, email, service: "Sign up" },
					photos: [],
					smsConsent: data.get("smsConsent") === "yes",
					emailConsent: data.get("emailConsent") === "yes",
				}),
			);
			form.reset();
			setStatus("success");
		} catch (error) {
			setStatus("error");
			setErrors({ form: error instanceof Error ? error.message : "Could not send the request." });
			document.getElementById(ids.error)?.focus();
		}
	}

	return (
		<section
			id={id}
			aria-labelledby={`${id}-heading`}
			className={styles.section}
		>
			<div className={styles.container}>
				<div className={styles.panel}>
					<div className={styles.photo} aria-hidden="true" />
					<div className={styles.content}>
						<h2 id={`${id}-heading`} className={styles.heading}>
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
										<span data-cms={errors.form ? undefined : "copy.home.deals.error"}>
										{errors.form ?? copy.error}
									</span>
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
										label={requiredLabel(copy.zipLabel)}
										cms={copy.zipLabel === requiredLabel(copy.zipLabel) ? "copy.home.deals.zipLabel" : undefined}
										inputMode="numeric"
										autoComplete="postal-code"
										placeholder={copy.zipPlaceholder}
										error={errors.zip}
										required
									/>
									<DealField
										id={ids.email}
										name="email"
										label={requiredLabel(copy.emailLabel)}
										cms={copy.emailLabel === requiredLabel(copy.emailLabel) ? "copy.home.deals.emailLabel" : undefined}
										type="email"
										autoComplete="email"
										placeholder={copy.emailPlaceholder}
										error={errors.email}
										required
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
	if (zipPattern.test(zip)) delete next.zip;
	if (emailPattern.test(email)) delete next.email;
	if (data.get("smsConsent") === "yes") delete next.sms;
	if (data.get("emailConsent") === "yes") delete next.emailConsent;
	return next;
}

function requiredLabel(label: string) {
	return label.replace(/\s*\(optional\)/gi, "").trim();
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
	required = false,
}: {
	id: string;
	name: string;
	label: string;
	cms?: string;
	type?: string;
	autoComplete?: string;
	inputMode?: "numeric";
	placeholder: string;
	error?: string;
	required?: boolean;
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
				required={required}
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
