"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
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

export function TvPhotoMarquee({
	photos,
	label = "TV Mounting",
	roomy = false,
	heading = true,
}: {
	photos: Photo[];
	label?: string;
	roomy?: boolean;
	heading?: boolean;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const loop = loopPhotos(photos);

	if (photos.length === 0) return null;

	function step(direction: 1 | -1) {
		const track = trackRef.current;
		if (!track) return;
		const item = track.querySelector("li");
		const group = track.querySelector("ul");
		const gap = Number.parseFloat(getComputedStyle(group ?? track).columnGap || "10") || 10;
		const distance = (item?.getBoundingClientRect().width ?? 174) + gap;
		const animation = track.getAnimations()[0];
		if (!animation) {
			viewportRef.current?.scrollBy({ left: direction * distance, behavior: "smooth" });
			return;
		}
		const duration = Number(animation.effect?.getComputedTiming().duration ?? 0);
		const groupWidth = group?.getBoundingClientRect().width ?? 0;
		if (!duration || !groupWidth) return;
		const delta = (distance / groupWidth) * duration * direction;
		const current = Number(animation.currentTime ?? 0);
		animation.currentTime = ((current + delta) % duration + duration) % duration;
	}

	return (
		<div className={roomy ? `${styles.marquee} ${styles.marqueeRoom}` : styles.marquee}>
			{roomy || !heading ? null : <h1 className={shared.visuallyHidden}>{label}</h1>}
			<div className={roomy ? `${styles.viewport} ${styles.viewportRoom}` : styles.viewport} ref={viewportRef}>
				<div
					ref={trackRef}
					className={styles.track}
					style={{ animationDuration: `${loop.length * 6.5}s` }}
				>
					{[0, 1].map((copy) => (
						<ul
							key={copy}
							className={styles.group}
							aria-hidden={copy === 1 ? true : undefined}
						>
							{loop.map((photo, index) => (
								<li key={`${copy}-${photo.id}-${index}`} className={styles.item}>
									<Image
										src={assetPath(photo.src)}
										alt={copy === 0 && index < photos.length ? photo.alt : ""}
										fill
										priority={copy === 0 && index < 3}
										sizes="226px"
										className={styles.image}
									/>
								</li>
							))}
						</ul>
					))}
				</div>
				<button type="button" className={styles.previous} onClick={() => step(-1)}>
					<ChevronLeft size={18} strokeWidth={2.25} aria-hidden="true" />
					<span className={shared.visuallyHidden}>Previous photos</span>
				</button>
				<button type="button" className={styles.next} onClick={() => step(1)}>
					<ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
					<span className={shared.visuallyHidden}>Next photos</span>
				</button>
			</div>
		</div>
	);
}
