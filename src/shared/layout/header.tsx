"use client";

import { BrandLogo } from "@/shared/ui";
import { QuoteCta } from "@/features/quote";
import { nav, site } from "@/lib/site";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import shared from "@/styles/shared.module.css";
import styles from "./header.module.css";

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
			className={`${styles.header} ${scrolled ? styles.headerScrolled : styles.headerTop}`}
		>
			<div className={styles.headerBar}>
				<div className={styles.headerRow}>
					<span className={styles.hours}>24/7</span>
					<Link
						href="/"
						className={styles.logoLink}
						onClick={() => setOpen(false)}
					>
						<BrandLogo priority plain />
						<span className={shared.visuallyHidden}>{site.name}</span>
					</Link>

					<nav
						className={styles.desktopNav}
						aria-label="Primary"
					>
						{nav.map(item => (
							<Link
								key={item.href}
								href={item.href}
								className={styles.navLink}
							>
								{item.label}
							</Link>
						))}
					</nav>

					<a
						href={site.phoneHref}
						className={styles.phone}
					>
						<Phone size={14} aria-hidden="true" />
						<span className={styles.phoneLabel}>
							{site.phoneDisplay}
						</span>
					</a>

					<QuoteCta className={styles.headerQuote}>
						GET QUOTE
					</QuoteCta>

					<button
						type="button"
						className={styles.menuButton}
						aria-expanded={open}
						aria-controls={panelId}
						onClick={() => setOpen(value => !value)}
					>
						{open ? (
							<X size={18} aria-hidden="true" />
						) : (
							<Menu size={18} aria-hidden="true" />
						)}
						<span className={shared.visuallyHidden}>{open ? "Close menu" : "Open menu"}</span>
					</button>
				</div>
			</div>

			{open ? (
				<nav
					id={panelId}
					aria-label="Mobile"
					className={styles.mobileNav}
				>
					{nav.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className={styles.mobileNavLink}
							onClick={() => setOpen(false)}
						>
							{item.label}
						</Link>
					))}
					<a
						href={site.phoneHref}
						className={styles.mobilePhone}
						onClick={() => setOpen(false)}
					>
						<Phone size={15} aria-hidden="true" />
						<span>{site.phoneDisplay}</span>
					</a>
					<QuoteCta className={styles.mobileQuote}>
						GET QUOTE
					</QuoteCta>
				</nav>
			) : null}
		</header>
	);
}
