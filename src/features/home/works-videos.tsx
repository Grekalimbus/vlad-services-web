"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { addWorksVideo } from "@/features/editor/works-actions";
import { worksVideos, type WorksVideo } from "@/lib/cms/works-videos";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { socialLinks } from "@/lib/social";
import { assetPath } from "@/lib/site";
import { InstagramIcon, YouTubeIcon } from "@/shared/brand-icons";
import shared from "@/styles/shared.module.css";
import styles from "./works-videos.module.css";

/** Vertical Shorts/TikTok frame (9:16) — pinned on outer .item via inline style. */
const CARD_SIZES = {
	mobile: { width: 190, height: 290 },
	tablet: { width: 235, height: 370 },
	desktop: { width: 280, height: 450 },
} as const;

function cardSizeForWidth(width: number) {
	if (width >= 1024) return CARD_SIZES.desktop;
	if (width >= 640) return CARD_SIZES.tablet;
	return CARD_SIZES.mobile;
}

function frameStyle(size: { width: number; height: number }): CSSProperties {
	return {
		flex: "0 0 auto",
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: "auto",
		width: size.width,
		height: size.height,
		minWidth: size.width,
		maxWidth: size.width,
		minHeight: size.height,
		maxHeight: size.height,
		alignSelf: "flex-start",
	};
}

function useVideoCardFrame(): CSSProperties {
	/* SSR + first paint use desktop; effect syncs to viewport without hydration mismatch. */
	const [frame, setFrame] = useState<CSSProperties>(() => frameStyle(CARD_SIZES.desktop));

	useEffect(() => {
		const apply = () => setFrame(frameStyle(cardSizeForWidth(window.innerWidth)));
		apply();
		window.addEventListener("resize", apply);
		return () => window.removeEventListener("resize", apply);
	}, []);

	return frame;
}

function stepSize(viewport: HTMLElement) {
	const item = viewport.querySelector<HTMLElement>(`.${styles.item}`);
	if (!item) return 320;
	const gap = Number.parseFloat(getComputedStyle(viewport.querySelector(`.${styles.track}`) ?? item).columnGap || "14") || 14;
	return item.getBoundingClientRect().width + gap;
}

export function WorksVideos() {
	const cms = useCms();
	const editing = useEditing();
	const videos = worksVideos(cms);
	const viewportRef = useRef<HTMLDivElement>(null);
	const nudgeTimer = useRef<number | null>(null);
	const cardFrame = useVideoCardFrame();
	const [hovering, setHovering] = useState(false);
	const [nudging, setNudging] = useState(false);
	const [openAt, setOpenAt] = useState<number | null>(null);
	const paused = hovering || nudging || openAt != null;
	const playable = videos.filter((item) => item.media);

	useEffect(() => {
		return () => {
			if (nudgeTimer.current != null) window.clearTimeout(nudgeTimer.current);
		};
	}, []);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport || videos.length < 2) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce || paused) return;

		let frame = 0;
		let last = performance.now();
		const speed = 36;

		const tick = (now: number) => {
			const dt = Math.min(now - last, 48);
			last = now;
			viewport.scrollLeft += (speed * dt) / 1000;
			const max = viewport.scrollWidth - viewport.clientWidth;
			if (max > 0 && viewport.scrollLeft >= max - 1) viewport.scrollLeft = 0;
			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [videos.length, paused]);

	function nudge(dir: -1 | 1) {
		const viewport = viewportRef.current;
		if (!viewport) return;
		setNudging(true);
		if (nudgeTimer.current != null) window.clearTimeout(nudgeTimer.current);
		viewport.scrollBy({ left: dir * stepSize(viewport), behavior: "smooth" });
		nudgeTimer.current = window.setTimeout(() => setNudging(false), 520);
	}

	if (videos.length === 0 && !editing) return null;

	return (
		<div
			className={styles.wrap}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			{videos.length > 1 ? (
				<>
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowPrev}`}
						aria-label="Previous project video"
						onClick={() => nudge(-1)}
					>
						<ChevronLeft size={22} strokeWidth={2.25} />
					</button>
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowNext}`}
						aria-label="Next project video"
						onClick={() => nudge(1)}
					>
						<ChevronRight size={22} strokeWidth={2.25} />
					</button>
				</>
			) : null}

			<div className={styles.viewport} ref={viewportRef}>
				<ul className={styles.track}>
					{videos.map((video, index) => (
						<li key={video.id || index} className={styles.item} style={cardFrame}>
							<VideoCard
								video={video}
								index={index}
								editing={editing}
								onOpen={() => {
									if (editing || !video.media) return;
									const playableIndex = playable.findIndex((item) => item.id === video.id);
									setOpenAt(playableIndex >= 0 ? playableIndex : 0);
								}}
							/>
						</li>
					))}
				</ul>
			</div>

			<div className={styles.social}>
				<a
					href={socialLinks.instagram}
					className={styles.socialLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					<InstagramIcon className={styles.socialIcon} />
					Instagram
				</a>
				<span className={styles.socialMuted} aria-disabled="true">
					<YouTubeIcon className={`${styles.socialIcon} ${styles.youtubeIcon}`} />
					YouTube
				</span>
			</div>

			{editing ? (
				<button type="button" className={styles.add} data-editor-ui onClick={addWorksVideo}>
					Add video
				</button>
			) : null}

			{openAt != null && playable.length > 0
				? createPortal(
						<VideoFullscreen
							videos={playable}
							index={Math.min(openAt, playable.length - 1)}
							onIndex={setOpenAt}
							onClose={() => setOpenAt(null)}
						/>,
						document.body,
					)
				: null}
		</div>
	);
}

function VideoCard({
	video,
	index,
	editing,
	onOpen,
}: {
	video: WorksVideo;
	index: number;
	editing: boolean;
	onOpen: () => void;
}) {
	const empty = !video.media;
	const label = video.alt.trim() || `Project video ${index + 1}`;

	return (
		<div
			className={styles.card}
			data-cms-card={`worksVideo:${index}`}
			data-empty={empty ? "" : undefined}
		>
			{video.media ? (
				<video
					className={styles.preview}
					src={assetPath(video.media)}
					poster={video.poster ? assetPath(video.poster) : undefined}
					muted
					playsInline
					preload="metadata"
					aria-hidden="true"
					data-cms-src={`copy.home.works.videos.${index}.media`}
				/>
			) : (
				<span className={styles.placeholder} aria-hidden="true" />
			)}

			{editing ? (
				<span className={styles.shade} aria-hidden="true" />
			) : video.media ? (
				<button type="button" className={styles.hit} aria-label={`Play ${label}`} onClick={onOpen}>
					<span className={styles.shade} aria-hidden="true" />
					<span className={styles.play} aria-hidden="true">
						<Play size={28} strokeWidth={2.25} fill="currentColor" />
					</span>
				</button>
			) : (
				<span className={styles.shade} aria-hidden="true" />
			)}
		</div>
	);
}

function VideoFullscreen({
	videos,
	index,
	onIndex,
	onClose,
}: {
	videos: WorksVideo[];
	index: number;
	onIndex: (index: number) => void;
	onClose: () => void;
}) {
	const titleId = useId();
	const videoRef = useRef<HTMLVideoElement>(null);
	const current = videos[index];

	useEffect(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const node = videoRef.current;
		void node?.play().catch(() => undefined);
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
			if (videos.length < 2) return;
			if (event.key === "ArrowLeft") onIndex((index - 1 + videos.length) % videos.length);
			if (event.key === "ArrowRight") onIndex((index + 1) % videos.length);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [index, onClose, onIndex, videos.length]);

	if (!current?.media) return null;

	return (
		<div className={styles.lightbox} data-editor-ui>
			<button type="button" className={styles.dismiss} aria-label="Close video" onClick={onClose} />
			<div
				className={styles.dialog}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
			>
				<h2 id={titleId} className={shared.visuallyHidden}>
					{current.alt.trim() || `Project video ${index + 1}`}
				</h2>
				<video
					ref={videoRef}
					key={current.media}
					className={styles.player}
					src={assetPath(current.media)}
					poster={current.poster ? assetPath(current.poster) : undefined}
					controls
					playsInline
					autoPlay
				/>
				{videos.length > 1 ? (
					<>
						<button
							type="button"
							className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
							aria-label="Previous video"
							onClick={() => onIndex((index - 1 + videos.length) % videos.length)}
						>
							<ChevronLeft size={22} strokeWidth={2.25} />
						</button>
						<button
							type="button"
							className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
							aria-label="Next video"
							onClick={() => onIndex((index + 1) % videos.length)}
						>
							<ChevronRight size={22} strokeWidth={2.25} />
						</button>
					</>
				) : null}
			</div>
		</div>
	);
}
