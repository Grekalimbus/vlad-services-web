"use client";

import { BrandLogo } from "@/shared/ui";
import { QuoteCta } from "@/features/quote";
import { isServicePageSlug } from "@/lib/service-pages";
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
	const solid = isServicePageSlug(path.startsWith("/services/") ? path.slice("/services/".length) : "");

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
						<HeaderLinks items={cms.nav} linkClass={styles.navLink} dealsClass={styles.dealsLink} />
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
					<HeaderLinks
						items={cms.nav}
						linkClass={styles.mobileNavLink}
						dealsClass={styles.mobileDeals}
						onNavigate={() => setOpen(false)}
					/>
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

type HeaderNavItem = {
	href: string;
	label: string;
};

type HeaderLink = HeaderNavItem & {
	cmsIndex?: number;
	kind?: "deals";
};

function isServices(item: HeaderNavItem) {
	return item.href.includes("#services") || item.label.trim().toLowerCase() === "services";
}

function isReviews(item: HeaderNavItem) {
	return item.href.includes("#reviews") || item.label.trim().toLowerCase() === "reviews";
}

function isAreas(item: HeaderNavItem) {
	return item.href.includes("/areas") || item.label.trim().toLowerCase() === "areas";
}

function isBlog(item: HeaderNavItem) {
	return item.href.includes("/blog") || item.label.trim().toLowerCase() === "blog";
}

function headerLinks(items: HeaderNavItem[]): HeaderLink[] {
	const links: HeaderLink[] = [];
	let deals = false;
	let faq = false;
	let areas = items.some(isAreas);
	let blog = items.some(isBlog);
	items.forEach((item, index) => {
		if (isReviews(item) && !deals) {
			links.push({ href: "/#deals", label: "Deals", kind: "deals" });
			deals = true;
		}
		links.push({ ...item, href: isAreas(item) ? "#areas" : item.href, cmsIndex: index });
		if (isServices(item) && !areas) {
			links.push({ href: "#areas", label: "Areas" });
			areas = true;
		}
		if (isServices(item) && !deals && !items.some(isReviews)) {
			links.push({ href: "/#deals", label: "Deals", kind: "deals" });
			deals = true;
		}
		if (isReviews(item) && !faq) {
			links.push({ href: "/#faq", label: "FAQ" });
			faq = true;
			if (!blog) {
				links.push({ href: "/blog", label: "Blog" });
				blog = true;
			}
		}
	});
	if (!areas) links.push({ href: "#areas", label: "Areas" });
	if (!deals) links.push({ href: "/#deals", label: "Deals", kind: "deals" });
	if (!faq) links.push({ href: "/#faq", label: "FAQ" });
	if (!blog) links.push({ href: "/blog", label: "Blog" });
	return links;
}

function HeaderLinks({
	items,
	linkClass,
	dealsClass,
	onNavigate,
}: {
	items: HeaderNavItem[];
	linkClass: string;
	dealsClass: string;
	onNavigate?: () => void;
}) {
	return headerLinks(items).map((item) => (
		<HashLink
			key={`${item.kind ?? "nav"}-${item.href}-${item.cmsIndex ?? "extra"}`}
			href={item.href}
			className={item.kind === "deals" ? dealsClass : linkClass}
			onClick={onNavigate}
		>
			<span
				className={styles.navLabel}
				data-cms={item.cmsIndex != null ? `nav.${item.cmsIndex}.label` : undefined}
			>
				{item.label}
			</span>
		</HashLink>
	));
}
