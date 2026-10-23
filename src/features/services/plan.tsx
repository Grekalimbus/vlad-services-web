"use client";

import { useId, useState } from "react";
import { useQuote } from "@/features/quote";
import { useCms } from "@/lib/cms/use-cms";
import { tvCounts } from "@/lib/services";
import shared from "@/styles/shared.module.css";
import styles from "./plan.module.css";

export function Plan() {
	const copy = useCms().copy.plan;
	const labels = copy.labels as Record<string, string>;
	const [selected, setSelected] = useState<string | null>(null);
	const { openQuote } = useQuote();

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
				<h2 id="plan-heading" className={styles.heading}>
					<span data-cms="copy.plan.headingLead">{copy.headingLead}</span>{" "}
					<span className={styles.accent} data-cms="copy.plan.headingAccent">{copy.headingAccent}</span>
				</h2>
				<ul className={styles.options} role="radiogroup" aria-labelledby="plan-heading">
					{tvCounts.map((item) => {
						const active = selected === item.id;
						return (
							<li key={item.id}>
								<label className={active ? `${styles.card} ${styles.cardActive}` : styles.card}>
									<input
										type="radio"
										name="tv-deal"
										value={item.id}
										checked={active}
										onChange={() => setSelected(item.id)}
										className={shared.visuallyHidden}
									/>
									<span className={styles.radio} aria-hidden="true" />
									<TvStack screens={item.screens} />
									<span className={styles.label} data-cms={`copy.plan.labels.${item.id}`}>{labels[item.id] ?? item.count}</span>
								</label>
							</li>
						);
					})}
				</ul>
				<button
					type="button"
					className={styles.book}
					disabled={selected === null}
					onClick={() => openQuote("quote")}
				>
					<span data-cms="copy.plan.book">{copy.book}</span>
				</button>
			</div>
		</section>
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
