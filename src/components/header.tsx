"use client";

import { BrandLogo } from "@/components/brand-logo";
import { QuoteCta } from "@/components/cta";
import { nav, site } from "@/lib/site";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

export function Header() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const panelId = useId();

	useEffect(() => {
		const updateHeader = () => {
			const secondSection = document.getElementById("services");
			const threshold = secondSection
				? secondSection.getBoundingClientRect().top + window.scrollY
				: window.innerHeight;
			setScrolled(window.scrollY >= threshold - 1);
		};
		updateHeader();
		window.addEventListener("scroll", updateHeader, { passive: true });
		window.addEventListener("resize", updateHeader);
		return () => {
			window.removeEventListener("scroll", updateHeader);
			window.removeEventListener("resize", updateHeader);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<header
			className={`pointer-events-none fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
				scrolled
					? "border-white/10 bg-black/80 shadow-[0_8px_30px_rgb(0_0_0/0.22)] backdrop-blur-xl"
					: "border-transparent bg-transparent"
			}`}
		>
			<div className="relative z-10 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-5">
				<div className="pointer-events-auto flex items-center gap-2">
					<span
						style={{ fontSize: "40px", color: "#ffff" }}
						className="text-xs font-bold tracking-wide sm:text-sm"
					>
						24 HOURS
					</span>
					<Link
						href="/"
						className="floating-surface flex items-center rounded-full p-0.5"
						onClick={() => setOpen(false)}
					>
						<BrandLogo priority />
						<span className="sr-only">{site.name}</span>
					</Link>

					<nav
						className="floating-surface hidden items-center rounded-full p-1.5 lg:flex"
						aria-label="Primary"
					>
						{nav.map(item => (
							<Link
								key={item.href}
								href={item.href}
								className="rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<a
						href={site.phoneHref}
						className="phone-attention floating-surface hidden min-h-11 items-center gap-2 rounded-full px-4 text-foreground lg:inline-flex"
					>
						<Phone size={14} aria-hidden="true" />
						<span className="text-[0.8125rem] font-medium">
							{site.phoneDisplay}
						</span>
					</a>

					<QuoteCta className="hidden min-h-11 cursor-pointer items-center rounded-full bg-accent px-4 text-[0.75rem] font-medium tracking-wide text-accent-foreground shadow-[0_1px_2px_rgb(23_23_23/0.04),0_10px_24px_rgb(23_23_23/0.06)] transition-colors duration-200 hover:bg-foreground hover:text-background lg:inline-flex">
						GET QUOTE
					</QuoteCta>

					<button
						type="button"
						className="floating-surface inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-white lg:hidden"
						aria-expanded={open}
						aria-controls={panelId}
						onClick={() => setOpen(value => !value)}
					>
						{open ? (
							<X size={18} aria-hidden="true" />
						) : (
							<Menu size={18} aria-hidden="true" />
						)}
						<span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
					</button>
				</div>
			</div>

			{open ? (
				<nav
					id={panelId}
					aria-label="Mobile"
					className="pointer-events-auto floating-surface relative z-10 mx-auto mt-2 w-[calc(100%-2rem)] max-w-xs rounded-3xl p-2 lg:hidden"
				>
					{nav.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
							onClick={() => setOpen(false)}
						>
							{item.label}
						</Link>
					))}
					<a
						href={site.phoneHref}
						className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
						onClick={() => setOpen(false)}
					>
						<Phone size={15} aria-hidden="true" />
						<span>{site.phoneDisplay}</span>
					</a>
					<QuoteCta className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background">
						GET QUOTE
					</QuoteCta>
				</nav>
			) : null}
		</header>
	);
}
