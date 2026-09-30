"use client";

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
		if (email && !emailPattern.test(email))
			nextErrors.email = "Enter a valid email.";

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
				smsConsent: true,
				emailConsent: Boolean(email),
			}),
		);
		form.reset();
		setStatus("success");
	}

	return (
		<section
			id="contact"
			aria-labelledby="deals-heading"
			className={styles.section}
		>
			<div className={styles.container}>
				<div className={styles.panel}>
					<div className={styles.photo} aria-hidden="true" />
					<div className={styles.content}>
						<h2 id="deals-heading" className={styles.heading}>
							Sign Up for <span className={styles.accent}>Deals</span>
						</h2>
						{status === "success" ? (
							<p role="status" className={styles.success}>
								Thank you! You&apos;re signed up for PrimeFix deals.
							</p>
						) : (
							<form onSubmit={onSubmit} noValidate className={styles.form}>
								{status === "error" ? (
									<p
										id={ids.error}
										tabIndex={-1}
										role="alert"
										className={styles.formError}
									>
										Check the fields below before sending.
									</p>
								) : null}
								<div className={styles.grid}>
									<DealField
										id={ids.name}
										name="name"
										label="Name"
										autoComplete="name"
										placeholder="Enter your name."
										error={errors.name}
									/>
									<DealField
										id={ids.phone}
										name="phone"
										label="Phone Number"
										type="tel"
										autoComplete="tel"
										placeholder="Enter a phone number."
										error={errors.phone}
									/>
									<DealField
										id={ids.zip}
										name="zip"
										label="ZIP Code"
										inputMode="numeric"
										autoComplete="postal-code"
										placeholder="Enter a 5-digit ZIP code."
										error={errors.zip}
									/>
									<DealField
										id={ids.email}
										name="email"
										label="Email (Optional)"
										type="email"
										autoComplete="email"
										placeholder="Enter your email"
										error={errors.email}
									/>
								</div>
								<div className={styles.consentWrap}>
									<ConsentFields />
								</div>
								<button
									type="submit"
									disabled={status === "loading"}
									className={styles.submit}
								>
									{status === "loading" ? "Sending…" : "Sign Up"}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function DealField({
	id,
	name,
	label,
	type = "text",
	autoComplete,
	inputMode,
	placeholder,
	error,
}: {
	id: string;
	name: string;
	label: string;
	type?: string;
	autoComplete?: string;
	inputMode?: "numeric";
	placeholder: string;
	error?: string;
}) {
	return (
		<div className={styles.field}>
			<label htmlFor={id} className={styles.label}>
				{label}
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
				className={styles.input}
			/>
			{error ? (
				<p id={`${id}-error`} className={styles.error}>
					{error}
				</p>
			) : null}
		</div>
	);
}
