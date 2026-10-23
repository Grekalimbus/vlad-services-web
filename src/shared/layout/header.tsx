"use client";

import { BrandLogo } from "@/shared/ui";
import { QuoteCta } from "@/features/quote";
import { phoneHref } from "@/lib/site";
import { useCms } from "@/lib/cms/use-cms";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import shared from "@/styles/shared.module.css";
import { HashLink, HashScroll } from "./hash-link";
import styles from "./header.module.css";

export function Header() {
	const cms = useCms();
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const panelId = useId();
	const pathname = usePathname();
	const path = pathname.replace(/\/$/, "");
	const admin = path === "/admin" || path.startsWith("/admin/");
	const solid =
		path === "/services/tv-mounting" ||
		path === "/services/electrical" ||
		path === "/services/handyman";

	useEffect(() => {
		const updateHeader = () => {
			setScrolled(window.scrollY >= 25);
		};
		updateHeader();
		window.addEventListener("scroll", updateHeader, { passive: true });
		return () => window.removeEventListener("scroll", updateHeader);
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

	if (admin) return null;

	return (
		<header
			className={`${styles.header} ${solid || scrolled ? styles.headerScrolled : styles.headerTop}`}
		>
			<HashScroll />
			<div className={styles.headerBar}>
				<div className={styles.headerRow}>
					<div className={styles.brand}>
						<Link
							href="/"
							className={styles.logoLink}
							onClick={() => setOpen(false)}
						>
							<BrandLogo priority plain />
							<span className={shared.visuallyHidden}>{cms.site.name}</span>
						</Link>
					</div>

					<nav
						className={styles.desktopNav}
						aria-label="Primary"
					>
						{cms.nav.map((item, index) => (
							<HashLink
								key={item.href}
								href={item.href}
								className={styles.navLink}
							>
								<span className={styles.navLabel} data-cms={`nav.${index}.label`}>{item.label}</span>
							</HashLink>
						))}
					</nav>

					<div className={styles.actions}>
						<a
							href={phoneHref(cms.site.phoneDisplay)}
							className={styles.phone}
						>
							<Phone size={14} aria-hidden="true" />
							<span className={styles.phoneLabel} data-cms="site.phoneDisplay">
								{cms.site.phoneDisplay}
							</span>
						</a>

						<QuoteCta className={styles.headerQuote}>
							<span data-cms="ctas.quote">{cms.ctas.quote}</span>
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
			</div>

			{open ? (
				<nav
					id={panelId}
					aria-label="Mobile"
					className={styles.mobileNav}
				>
					{cms.nav.map((item, index) => (
						<HashLink
							key={item.href}
							href={item.href}
							className={styles.mobileNavLink}
							onClick={() => setOpen(false)}
						>
							<span data-cms={`nav.${index}.label`}>{item.label}</span>
						</HashLink>
					))}
					<a
						href={phoneHref(cms.site.phoneDisplay)}
						className={styles.mobilePhone}
						onClick={() => setOpen(false)}
					>
						<Phone size={15} aria-hidden="true" />
						<span data-cms="site.phoneDisplay">{cms.site.phoneDisplay}</span>
					</a>
					<QuoteCta className={styles.mobileQuote}>
						<span data-cms="ctas.quote">{cms.ctas.quote}</span>
					</QuoteCta>
				</nav>
			) : null}
		</header>
	);
}
