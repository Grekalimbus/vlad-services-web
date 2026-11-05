"use client";

import { FormEvent, useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { isDiscountCard, planDescriptions, planQuiz, planQuizForm, type TvQuizStep } from "@/lib/cms/tv-page";
import { peekReveal, revealSurface, subscribeReveal } from "@/lib/cms/reveal";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { hearAboutOptions } from "@/lib/hear-about";
import { buildLeadPayload, submitLead } from "@/lib/leads";
import { tvCounts } from "@/lib/services";
import { nationalDigits, useUsPhone } from "@/lib/use-us-phone";
import shared from "@/styles/shared.module.css";
import { TvDiscountDialog } from "./tv-discount-dialog";
import styles from "./plan.module.css";

export function Plan() {
	const cms = useCms();
	const editing = useEditing();
	const revealed = useSyncExternalStore(subscribeReveal, peekReveal, () => null);
	const copy = cms.copy.plan;
	const labels = copy.labels as Record<string, string>;
	const notes = planDescriptions(cms);
	const quiz = planQuiz(cms);
	const quizForm = planQuizForm(cms);
	const total = quiz.length + 2;
	const [selected, setSelected] = useState<string | null>(null);
	const [offer, setOffer] = useState<"2" | "3" | "4plus" | null>(null);
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
	const headingRef = useRef<HTMLHeadingElement>(null);
	const revealedOffer = revealed?.startsWith("tv-offer:") ? revealed.slice("tv-offer:".length) : "";
	const editingOffer = isDiscountCard(revealedOffer) ? revealedOffer : null;
	const activeOffer = editing ? editingOffer : offer;
	const question = step > 0 && step <= quiz.length ? quiz[step - 1] : null;
	const heading =
		step === 0
			? { lead: copy.headingLead, accent: copy.headingAccent, leadPath: "copy.plan.headingLead", accentPath: "copy.plan.headingAccent" }
			: question
				? {
						lead: question.lead,
						accent: question.accent,
						leadPath: `copy.plan.quiz.steps.${step - 1}.lead`,
						accentPath: `copy.plan.quiz.steps.${step - 1}.accent`,
					}
				: {
						lead: quizForm.lead,
						accent: quizForm.accent,
						leadPath: "copy.plan.quiz.form.lead",
						accentPath: "copy.plan.quiz.form.accent",
					};

	useEffect(() => {
		if (step === 0) return;
		headingRef.current?.focus({ preventScroll: true });
	}, [step]);

	return (
		<section id="plan" aria-labelledby="plan-heading" className={styles.section}>
			<div className={styles.atmosphere} aria-hidden="true">
				<span className={styles.glowLeft} />
				<span className={styles.glowRight} />
				<span className={`${styles.arc} ${styles.arcLeft}`} />
				<span className={`${styles.arc} ${styles.arcLeftInner}`} />
				<span className={`${styles.arc} ${styles.arcRight}`} />
				<span className={`${styles.arc} ${styles.arcRightInner}`} />
				<span className={styles.dots} />
			</div>
			<div className={styles.inner}>
				<h2 id="plan-heading" ref={headingRef} tabIndex={-1} className={styles.heading}>
					<span data-cms={heading.leadPath}>{heading.lead}</span>{" "}
					<span className={styles.accent} data-cms={heading.accentPath}>
						{heading.accent}
					</span>
				</h2>
				{step === 0 ? (
					<>
						<ul className={styles.options} role="radiogroup" aria-labelledby="plan-heading">
							{tvCounts.map((item) => {
						const active = selected === item.id;
						const discount = isDiscountCard(item.id) ? item.id : null;
						return (
							<li key={item.id}>
								<label
									className={active ? `${styles.card} ${styles.cardActive}` : styles.card}
									data-cms-reveal={discount ? `tv-offer:${discount}` : undefined}
									onClick={() => {
										if (editing && discount) return;
										setSelected(item.id);
										if (discount) {
											setOffer(discount);
											return;
										}
										setOffer(null);
										setStep(1);
									}}
								>
									<input
										type="radio"
										name="tv-deal"
										value={item.id}
										checked={active}
										onChange={() => {
											setSelected(item.id);
											if (discount) {
												if (editing) revealSurface(`tv-offer:${discount}`);
												else setOffer(discount);
												return;
											}
											setOffer(null);
											if (editing) revealSurface(null);
											setStep(1);
										}}
										className={shared.visuallyHidden}
									/>
									<span className={styles.caption}>
										<span className={styles.label} data-cms={`copy.plan.labels.${item.id}`}>{labels[item.id] ?? item.count}</span>
										<TvStack screens={item.screens} />
										<span className={styles.note} data-cms={`copy.plan.descriptions.${item.id}`}>{notes[item.id]}</span>
									</span>
								</label>
							</li>
						);
							})}
						</ul>
						<TrustIcons />
					</>
				) : question ? (
					<ul
						className={styles.choices}
						aria-label={question.multiple ? "Choose one or more options" : undefined}
						style={{ "--choice-count": question.options.length } as CSSProperties}
					>
						{question.options.map((option, index) => {
							const selectedOptions = multiAnswers[question.id] ?? [];
							const active = question.multiple && selectedOptions.includes(option.id);
							return (
								<li key={option.id}>
									<button
										type="button"
										aria-pressed={question.multiple ? active : undefined}
										className={active ? `${styles.choice} ${styles.choiceActive}` : styles.choice}
										onClick={(event) => {
											if (editing && (event.target as HTMLElement).closest("[data-cms]")) return;
											if (question.multiple) {
												setMultiAnswers((current) => {
													const values = current[question.id] ?? [];
													const next = values.includes(option.id)
														? values.filter((id) => id !== option.id)
														: [...values, option.id];
													return { ...current, [question.id]: next };
												});
												return;
											}
											setAnswers((current) => ({ ...current, [question.id]: option.title }));
											setStep((current) => current + 1);
										}}
									>
										<span className={styles.choiceTitle} data-cms={`copy.plan.quiz.steps.${step - 1}.options.${index}.title`}>
											{option.title}
										</span>
										<span className={styles.choiceDescription}>
											<span className={styles.choiceText} data-cms={`copy.plan.quiz.steps.${step - 1}.options.${index}.text`}>
												{option.text}
											</span>
											{option.accentText ? (
												<span
													className={styles.choiceTextAccent}
													data-cms={`copy.plan.quiz.steps.${step - 1}.options.${index}.accentText`}
												>
													{option.accentText}
												</span>
											) : null}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				) : (
					<QuizForm
						button={quizForm.button}
						answers={answers}
						steps={quiz}
					/>
				)}
				{step > 0 ? (
					<>
						<ol
							className={styles.meter}
							aria-label={`Step ${step + 1} of ${total}`}
						>
							{Array.from({ length: total }, (_, index) => {
								const active = index <= step;
								const current = index === step;
								return (
									<li key={index} className={active ? styles.meterOn : undefined}>
										{current ? (
											<span className={styles.meterStep} aria-hidden="true">
												{step + 1}
											</span>
										) : null}
									</li>
								);
							})}
						</ol>
						<div className={question?.multiple ? styles.navActions : `${styles.navActions} ${styles.navActionsSingle}`}>
							<button type="button" className={styles.back} onClick={() => setStep((current) => Math.max(0, current - 1))}>
								Back
							</button>
							{question?.multiple ? (
								<button
									type="button"
									className={styles.continue}
									onClick={() => {
										const selectedIds = multiAnswers[question.id] ?? [];
										const selectedTitles = question.options
											.filter((option) => selectedIds.includes(option.id))
											.map((option) => option.title);
										setAnswers((current) => ({ ...current, [question.id]: selectedTitles.join(", ") }));
										setStep((current) => current + 1);
									}}
								>
									Continue
								</button>
							) : null}
						</div>
					</>
				) : null}
			</div>
			{activeOffer && isDiscountCard(activeOffer) ? (
				<TvDiscountDialog
					id={activeOffer}
					onClose={() => {
						setOffer(null);
						if (editing) revealSurface(null);
					}}
				/>
			) : null}
		</section>
	);
}

function TrustIcons() {
	return (
		<ul className={styles.trustIcons} aria-label="Quality, reliability, professionalism, safety, and value">
			<li aria-label="Quality">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="m12 3 2.1 2.2 3-.4.5 3 2.6 1.5-1.4 2.7 1.4 2.7-2.6 1.5-.5 3-3-.4L12 21l-2.1-2.2-3 .4-.5-3-2.6-1.5L5.2 12 3.8 9.3l2.6-1.5.5-3 3 .4L12 3Z" />
					<path d="m8.8 12 2.1 2.1 4.5-4.5" />
				</svg>
			</li>
			<li aria-label="Reliability">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 3.2 19 6v5.2c0 4.2-2.8 7.8-7 9.6-4.2-1.8-7-5.4-7-9.6V6l7-2.8Z" />
					<path d="m8.8 12 2 2 4.5-4.5" />
				</svg>
			</li>
			<li aria-label="Professionalism">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M8 7V5.7C8 4.8 8.8 4 9.7 4h4.6c.9 0 1.7.8 1.7 1.7V7" />
					<rect x="3.5" y="7" width="17" height="12.5" rx="2.2" />
					<path d="M3.8 11.5c5.3 2.2 11.1 2.2 16.4 0M10.2 12.8h3.6" />
				</svg>
			</li>
			<li aria-label="Safety">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<rect x="5" y="10" width="14" height="10" rx="2.2" />
					<path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2.5" />
				</svg>
			</li>
			<li aria-label="Value">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="12" r="8.5" />
					<path d="M14.8 8.7c-.7-.6-1.6-.9-2.7-.9-1.5 0-2.7.8-2.7 2s1.1 1.7 2.8 2.1 2.8.9 2.8 2.2-1.2 2.2-2.9 2.2c-1.1 0-2.2-.4-3-1.1M12 6.2v11.6" />
				</svg>
			</li>
		</ul>
	);
}

function QuizForm({
	button,
	answers,
	steps,
}: {
	button: string;
	answers: Record<string, string>;
	steps: TvQuizStep[];
}) {
	const editing = useEditing();
	const nameId = useId();
	const phoneId = useId();
	const hearId = useId();
	const errorId = useId();
	const phoneField = useUsPhone();
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [formError, setFormError] = useState("");
	const [hearAbout, setHearAbout] = useState("");
	const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; hearAbout?: boolean }>({});

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (editing) return;
		const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
		const next: { name?: boolean; phone?: boolean; hearAbout?: boolean } = {};
		if (name.length < 2) next.name = true;
		if (nationalDigits(phoneField.phone).length !== 10) next.phone = true;
		if (!hearAbout) next.hearAbout = true;
		setErrors(next);
		setFormError("");
		if (Object.keys(next).length > 0) {
			setStatus("error");
			document.getElementById(next.name ? nameId : next.phone ? phoneId : hearId)?.focus();
			return;
		}
		const fields: Record<string, string> = {
			name,
			phone: phoneField.phone,
			service: "1 TV quote",
			tvCount: "1",
			hearAbout,
		};
		for (const item of steps) {
			if (answers[item.id]) fields[item.id] = answers[item.id];
		}
		setStatus("loading");
		try {
			await submitLead(
				buildLeadPayload({
					type: "tv-mounting",
					formId: "tv-quiz",
					fields,
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

	if (status === "success") {
		return (
			<p role="status" className={styles.quizSuccess}>
				Thank you. We&apos;ll call you with your quote.
			</p>
		);
	}

	return (
		<form className={styles.quizForm} noValidate onSubmit={onSubmit}>
			{formError ? (
				<p id={errorId} tabIndex={-1} role="alert" className={styles.quizAlert}>
					{formError}
				</p>
			) : null}
			<div className={styles.quizField}>
				<label className={shared.visuallyHidden} htmlFor={nameId}>
					Your name
				</label>
				<input
					id={nameId}
					name="name"
					autoComplete="name"
					placeholder="Your name"
					required
					className={errors.name ? `${styles.quizInput} ${styles.quizInvalid}` : styles.quizInput}
					aria-invalid={errors.name ? true : undefined}
					onChange={() => {
						if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
					}}
				/>
			</div>
			<div className={styles.quizField}>
				<label className={shared.visuallyHidden} htmlFor={phoneId}>
					Phone number
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
					required
					onChange={(event) => {
						const count = phoneField.onPhoneChange(event);
						if (errors.phone && count === 10) setErrors((current) => ({ ...current, phone: undefined }));
					}}
					onBeforeInput={phoneField.onBeforeInput}
					className={errors.phone ? `${styles.quizInput} ${styles.quizInvalid}` : styles.quizInput}
					aria-invalid={errors.phone ? true : undefined}
				/>
			</div>
			<div className={styles.quizField}>
				<label className={shared.visuallyHidden} htmlFor={hearId}>
					How did you hear about us?
				</label>
				<select
					id={hearId}
					name="hearAbout"
					value={hearAbout}
					required
					onChange={(event) => {
						setHearAbout(event.target.value);
						if (errors.hearAbout && event.target.value) {
							setErrors((current) => ({ ...current, hearAbout: undefined }));
						}
					}}
					className={[
						styles.quizSelect,
						hearAbout ? undefined : styles.quizSelectEmpty,
						errors.hearAbout ? styles.quizInvalid : undefined,
					]
						.filter(Boolean)
						.join(" ")}
					aria-invalid={errors.hearAbout ? true : undefined}
				>
					<option value="">How did you hear about us?</option>
					{hearAboutOptions.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
			<button type="submit" className={styles.quizSubmit} disabled={status === "loading"}>
				<span data-cms="copy.plan.quiz.form.button">{status === "loading" ? "Sending…" : button}</span>
			</button>
		</form>
	);
}

function TvStack({ screens }: { screens: number }) {
	const rawId = useId().replace(/:/g, "");
	const sides = Math.max(0, Math.min(screens, 4) - 1);
	const screenW = 88;
	const screenH = 50;
	const sideW = 10;
	const gap = 3;
	const footH = 6;
	const width = screenW + sides * (sideW + gap);
	const height = screenH + footH;
	const face = `${rawId}-face`;
	const sideShades = ["#c5ced6", "#97a3ae", "#7c8793"];

	return (
		<svg
			className={styles.tvs}
			viewBox={`0 0 ${width} ${height}`}
			role="presentation"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={face} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#ffffff" />
					<stop offset="34%" stopColor="#e7edf3" />
					<stop offset="68%" stopColor="#c5d0db" />
					<stop offset="100%" stopColor="#f3f6f8" />
				</linearGradient>
				<clipPath id={`${rawId}-clip`}>
					<rect width={screenW} height={screenH} rx="2.5" />
				</clipPath>
			</defs>
			<g clipPath={`url(#${rawId}-clip)`}>
				<rect width={screenW} height={screenH} fill={`url(#${face})`} />
				<path
					d={`M0 0 H${screenW * 0.58} L${screenW * 0.2} ${screenH} H0 Z`}
					fill="#fff"
					opacity="0.42"
				/>
			</g>
			<rect x="11" y={screenH} width="3" height={footH} rx="0.4" fill="#24303c" />
			<rect x={screenW - 14} y={screenH} width="3" height={footH} rx="0.4" fill="#24303c" />
			{Array.from({ length: sides }, (_, index) => {
				const x = screenW + gap + index * (sideW + gap);
				return (
					<g key={index}>
						<rect
							x={x}
							y="1"
							width={sideW}
							height={screenH - 2}
							rx="1.2"
							fill={sideShades[index] ?? sideShades[2]}
						/>
						<rect x={x + 1.5} y={screenH} width="2" height={footH - 1} fill="#24303c" />
						<rect x={x + sideW - 3.5} y={screenH} width="2" height={footH - 1} fill="#24303c" />
					</g>
				);
			})}
		</svg>
	);
}
