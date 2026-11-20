"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PhotoLightbox } from "@/features/gallery/photo-lightbox";
import { useEditing } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./tv-photo-marquee.module.css";

type Photo = {
	id: string;
	src: string;
	alt: string;
};

function loopPhotos(photos: Photo[]) {
	if (photos.length === 0) return [];
	const copies = Math.max(2, Math.ceil(8 / photos.length));
	return Array.from({ length: copies }, () => photos).flat();
}

function stepSize(viewport: HTMLElement) {
	const item = viewport.querySelector<HTMLElement>(`.${styles.item}`);
	if (!item) return 220;
	const stylesMap = getComputedStyle(viewport.querySelector(`.${styles.group}`) ?? item);
	const gap = Number.parseFloat(stylesMap.columnGap || stylesMap.gap || "9") || 9;
	return item.getBoundingClientRect().width + gap;
}

export function TvPhotoMarquee({
	photos,
	label = "TV Mounting",
	roomy = false,
	heading = true,
	direction = "left",
	paired = false,
	seamless = false,
	plain = false,
}: {
	photos: Photo[];
	label?: string;
	roomy?: boolean;
	heading?: boolean;
	direction?: "left" | "right";
	paired?: boolean;
	seamless?: boolean;
	/** Transparent photo strip without the service-page overlap padding. */
	plain?: boolean;
}) {
	const editing = useEditing();
	const viewportRef = useRef<HTMLDivElement>(null);
	const nudgeTimer = useRef<number | null>(null);
	const [hovering, setHovering] = useState(false);
	const [nudging, setNudging] = useState(false);
	const [lightbox, setLightbox] = useState<number | null>(null);
	const loop = loopPhotos(photos);
	const lightboxPhotos = photos.map((photo) => ({ image: photo.src, alt: photo.alt }));
	const paused = hovering || nudging || lightbox != null;

	useEffect(() => {
		return () => {
			if (nudgeTimer.current != null) window.clearTimeout(nudgeTimer.current);
		};
	}, []);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport || photos.length === 0) return;

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce || paused) return;

		let frame = 0;
		let last = performance.now();
		const speed = 42;
		const sign = direction === "right" ? -1 : 1;

		const tick = (now: number) => {
			const dt = Math.min(now - last, 48);
			last = now;
			viewport.scrollLeft += sign * ((speed * dt) / 1000);

			const half = viewport.scrollWidth / 2;
			if (half > 0) {
				if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
				if (viewport.scrollLeft <= 0) viewport.scrollLeft += half;
			}
			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [photos.length, paused, direction]);

	function nudge(dir: -1 | 1) {
		const viewport = viewportRef.current;
		if (!viewport) return;
		setNudging(true);
		if (nudgeTimer.current != null) window.clearTimeout(nudgeTimer.current);
		const amount = stepSize(viewport) * (direction === "right" ? -dir : dir);
		viewport.scrollBy({ left: amount, behavior: "smooth" });
		nudgeTimer.current = window.setTimeout(() => setNudging(false), 520);
	}

	if (photos.length === 0) return null;

	const marqueeClass = [
		styles.marquee,
		roomy || plain ? styles.marqueeRoom : "",
		paired ? styles.marqueePaired : "",
		seamless ? styles.marqueeSeamless : "",
	]
		.filter(Boolean)
		.join(" ");
	const viewportClass = [styles.viewport, roomy ? styles.viewportRoom : "", paired ? styles.viewportPaired : ""]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={marqueeClass}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			{roomy || plain || !heading ? null : <h1 className={shared.visuallyHidden}>{label}</h1>}
			{photos.length > 1 ? (
				<>
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowPrev}`}
						aria-label={`Previous ${label} photo`}
						onClick={() => nudge(-1)}
					>
						<ChevronLeft size={22} strokeWidth={2.25} />
					</button>
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowNext}`}
						aria-label={`Next ${label} photo`}
						onClick={() => nudge(1)}
					>
						<ChevronRight size={22} strokeWidth={2.25} />
					</button>
				</>
			) : null}
			<div className={viewportClass} ref={viewportRef}>
				<ul className={styles.group}>
					{[0, 1].flatMap((copy) =>
						loop.map((photo, index) => {
							const sourceIndex = index % photos.length;
							const canonical = copy === 0 && index < photos.length;
							return (
								<li
									key={`${copy}-${photo.id}-${index}`}
									className={styles.item}
									aria-hidden={canonical ? undefined : true}
								>
									<Image
										src={assetPath(photo.src)}
										alt={canonical ? photo.alt : ""}
										fill
										priority={copy === 0 && index === 0}
										loading={copy === 0 && index < 2 ? "eager" : "lazy"}
										unoptimized={photo.src.startsWith("/api/media/")}
										sizes="226px"
										quality={70}
										className={styles.image}
									/>
									{editing ? (
										<span className={styles.shade} aria-hidden="true" />
									) : canonical ? (
										<button
											type="button"
											className={styles.hit}
											aria-label={`View ${photo.alt || `${label} photo ${sourceIndex + 1}`}`}
											onClick={() => setLightbox(sourceIndex)}
										>
											<span className={styles.shade} aria-hidden="true" />
										</button>
									) : (
										<span
											className={styles.hit}
											aria-hidden="true"
											onClick={() => setLightbox(sourceIndex)}
										>
											<span className={styles.shade} aria-hidden="true" />
										</span>
									)}
								</li>
							);
						}),
					)}
				</ul>
			</div>
			{lightbox != null && !editing ? (
				<PhotoLightbox
					photos={lightboxPhotos}
					index={lightbox}
					label={label}
					onIndex={setLightbox}
					onClose={() => setLightbox(null)}
				/>
			) : null}
		</div>
	);
}
