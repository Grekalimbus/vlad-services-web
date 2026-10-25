"use client";

import Image from "next/image";
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
	direction = "left",
	paired = false,
}: {
	photos: Photo[];
	label?: string;
	roomy?: boolean;
	heading?: boolean;
	direction?: "left" | "right";
	paired?: boolean;
}) {
	const loop = loopPhotos(photos);

	if (photos.length === 0) return null;

	const marqueeClass = [styles.marquee, roomy ? styles.marqueeRoom : "", paired ? styles.marqueePaired : ""]
		.filter(Boolean)
		.join(" ");
	const viewportClass = [styles.viewport, roomy ? styles.viewportRoom : "", paired ? styles.viewportPaired : ""]
		.filter(Boolean)
		.join(" ");
	const trackClass = direction === "right" ? `${styles.track} ${styles.trackRight}` : styles.track;

	return (
		<div className={marqueeClass}>
			{roomy || !heading ? null : <h1 className={shared.visuallyHidden}>{label}</h1>}
			<div className={viewportClass}>
				<div className={trackClass} style={{ animationDuration: `${loop.length * 6.5}s` }}>
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
										unoptimized={photo.src.startsWith("/api/media/")}
										sizes="226px"
										className={styles.image}
									/>
								</li>
							))}
						</ul>
					))}
				</div>
			</div>
		</div>
	);
}
