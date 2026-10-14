"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type MouseEvent, type ReactNode } from "react";

type HashLinkProps = {
	href: string;
	className?: string;
	children: ReactNode;
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToHash(hash: string) {
	const id = hash.replace(/^#/, "");
	if (!id) return false;
	const target = document.getElementById(id);
	if (!target) return false;
	target.scrollIntoView({
		behavior: prefersReducedMotion() ? "auto" : "smooth",
		block: "start",
	});
	if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
	target.focus({ preventScroll: true });
	return true;
}

export function HashLink({ href, className, children, onClick }: HashLinkProps) {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={className}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				const hashIndex = href.indexOf("#");
				if (hashIndex === -1) return;
				const path = href.slice(0, hashIndex) || "/";
				const id = href.slice(hashIndex + 1);
				if (!id) return;
				const current = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
				const targetPath = path.length > 1 ? path.replace(/\/$/, "") : path;
				if (current !== targetPath) return;
				if (!scrollToHash(id)) return;
				event.preventDefault();
				const url = new URL(window.location.href);
				url.hash = id;
				window.history.pushState(null, "", url);
			}}
		>
			{children}
		</Link>
	);
}

export function HashScroll() {
	const pathname = usePathname();

	useEffect(() => {
		const id = window.location.hash.replace(/^#/, "");
		if (!id) return;
		const frame = window.requestAnimationFrame(() => {
			scrollToHash(id);
		});
		const timer = window.setTimeout(() => {
			scrollToHash(id);
		}, 80);
		return () => {
			window.cancelAnimationFrame(frame);
			window.clearTimeout(timer);
		};
	}, [pathname]);

	return null;
}
