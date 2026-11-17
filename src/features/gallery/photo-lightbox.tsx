"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./photo-lightbox.module.css";

type PhotoInput = string | { image: string; alt?: string };

function photoSrc(photo: PhotoInput) {
	return typeof photo === "string" ? photo : photo.image;
}

function photoAlt(photo: PhotoInput) {
	return typeof photo === "string" ? "" : photo.alt?.trim() || "";
}

export function PhotoLightbox({
	photos,
	index,
	start,
	label = "Photos",
	onIndex,
	onClose,
}: {
	photos: PhotoInput[];
	/** Controlled index when provided with onIndex. */
	index?: number;
	/** Uncontrolled starting index when onIndex is omitted. */
	start?: number;
	label?: string;
	onIndex?: (index: number) => void;
	onClose: () => void;
}) {
	const titleId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);
	const controlled = typeof index === "number" && typeof onIndex === "function";
	const [localIndex, setLocalIndex] = useState(() => {
		const initial = controlled ? index : (start ?? 0);
		return Math.min(Math.max(initial, 0), Math.max(photos.length - 1, 0));
	});
	const currentIndex = controlled ? index : localIndex;
	const photo = photos[currentIndex];
	const count = photos.length;
	const src = photo ? photoSrc(photo) : "";

	const setCurrent = useCallback(
		(next: number) => {
			const safe = ((next % count) + count) % count;
			if (controlled) onIndex(safe);
			else setLocalIndex(safe);
		},
		[controlled, count, onIndex],
	);

	const step = useCallback(
		(delta: number) => {
			if (count < 2) return;
			setCurrent(currentIndex + delta);
		},
		[count, currentIndex, setCurrent],
	);

	useEffect(() => {
		if (!controlled) return;
		setLocalIndex(index);
	}, [controlled, index]);

	useEffect(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
			if (event.key === "ArrowLeft") step(-1);
			if (event.key === "ArrowRight") step(1);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose, step]);

	if (!photo || typeof document === "undefined") return null;

	return createPortal(
		<div className={styles.lightbox} data-editor-ui>
			<button type="button" className={styles.dismiss} aria-label="Close photos" onClick={onClose} />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={styles.dialog}
			>
				<div className={styles.dialogHead}>
					<h2 id={titleId} className={styles.dialogTitle}>
						{label}
						<span className={styles.dialogCount}>
							{currentIndex + 1} / {count}
						</span>
					</h2>
					<button type="button" className={styles.close} onClick={onClose}>
						<X size={16} aria-hidden="true" />
						<span className={shared.visuallyHidden}>Close</span>
					</button>
				</div>
				<div className={styles.stage}>
					<Image
						key={src}
						src={assetPath(src)}
						alt={photoAlt(photo)}
						fill
						sizes="90vw"
						className={styles.stageImage}
						unoptimized={src.startsWith("/api/media/") || src.startsWith("http")}
						priority
					/>
					{count > 1 ? (
						<>
							<button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)}>
								<ChevronLeft size={22} aria-hidden="true" />
								<span className={shared.visuallyHidden}>Previous photo</span>
							</button>
							<button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)}>
								<ChevronRight size={22} aria-hidden="true" />
								<span className={shared.visuallyHidden}>Next photo</span>
							</button>
						</>
					) : null}
				</div>
			</div>
		</div>,
		document.body,
	);
}
