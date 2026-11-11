"use client";

import Image from "next/image";
import Link from "next/link";
import { AREA_SELECT_EVENT, serviceAreas, type AreaSelectDetail } from "@/features/areas/areas";
import { dealsPage } from "@/lib/cms/deals-page";
import { useCms } from "@/lib/cms/use-cms";
import { googleListing } from "@/lib/google-reviews";
import { socialLinks } from "@/lib/social";
import { phoneHref } from "@/lib/site";
import { InstagramIcon, LinkedInIcon, YelpIcon } from "@/shared/brand-icons";
import { BrandLogo } from "@/shared/ui";
import { HashLink } from "./hash-link";
import shared from "@/styles/shared.module.css";
import styles from "./footer.module.css";

function GoogleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path
				fill="currentColor"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"
			/>
			<path
				fill="currentColor"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
			/>
			<path
				fill="currentColor"
				d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
			/>
			<path
				fill="currentColor"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
			/>
		</svg>
	);
}

function BbbIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="152 17 313 582" className={className} aria-hidden="true" fill="currentColor">
			<path d="M174.387 329.496c-24.211 33.38-16.791 80.066 16.577 104.295l75.68 54.959c8.401 6.054 10.262 17.793 4.144 26.148l11.347 8.19 39.962-55.058c9.278-12.687 14.288-27.993 14.307-43.711-.035-3.999-.364-7.989-.987-11.939-3.022-19.527-13.668-37.057-29.601-48.743l-75.581-54.861c-4.206-2.815-7.062-7.243-7.894-12.235-.099-.987-.099-1.973 0-2.96.026-3.93 1.266-7.756 3.552-10.952l-11.347-8.289zm45.586-220.824c-13.403 18.402-20.624 40.581-20.622 63.346-.03 5.782.434 11.564 1.381 17.268 4.412 28.393 20.012 53.837 43.316 70.647l95.119 69.069c12.46 9 20.808 22.606 23.187 37.791.506 3.066.77 6.167.79 9.275-.049 12.146-3.953 23.962-11.15 33.745l9.176 6.611 74.891-103.505C471.029 264.443 460.215 196.824 411.886 161.658L297.133 78.282c-7.176-5.197-11.973-13.05-13.321-21.806-1.463-8.748.672-17.715 5.92-24.865l-9.077-6.611z" />
			<rect x="172" y="543" width="273" height="27.4" rx="4.1" />
		</svg>
	);
}

const brandSocial = [
	{ href: "https://maps.app.goo.gl/cZ8BVENdcqzqpoXh8", label: "Google", Icon: GoogleIcon },
	{ href: socialLinks.bbb, label: "BBB", Icon: BbbIcon },
	{ href: socialLinks.instagram, label: "Instagram", Icon: InstagramIcon },
	{ href: socialLinks.yelp, label: "Yelp", Icon: YelpIcon },
	{ href: socialLinks.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
] as const;

function selectArea(detail: AreaSelectDetail) {
	window.dispatchEvent(new CustomEvent<AreaSelectDetail>(AREA_SELECT_EVENT, { detail }));
}

function BbbSeal({ className }: { className?: string }) {
	return (
		<a
			href={socialLinks.bbb}
			className={className ? `${styles.bbbSeal} ${className}` : styles.bbbSeal}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="BBB Accredited Business"
		>
			<Image
				src="/footer/bbb-accredited.jpg"
				alt="BBB Accredited Business"
				width={1000}
				height={379}
				className={styles.bbbSealImage}
			/>
		</a>
	);
}

export function Footer() {
	const cms = useCms();
	const services = cms.serviceCategories.filter(
		(category) => category.featured && category.status === "active",
	);
	const deals = dealsPage(cms).items;
	const regions = serviceAreas;
	const googleMapsUrl = googleListing.mapsUrl || brandSocial[0].href;

	return (
		<footer id="footer" tabIndex={-1} className={styles.footer}>
			<div className={styles.atmosphere} aria-hidden="true">
				<span className={styles.dots} />
				<span className={`${styles.arc} ${styles.arcLeft}`} />
				<span className={`${styles.arc} ${styles.arcLeftInner}`} />
				<span className={`${styles.arc} ${styles.arcRight}`} />
				<span className={`${styles.arc} ${styles.arcRightInner}`} />
			</div>
			<div className={styles.inner}>
				<div className={styles.cluster}>
					<div className={styles.columns}>
						<div className={styles.brandCol}>
							<Link href="/" className={styles.brandLink}>
								<BrandLogo plain />
								<span className={shared.visuallyHidden}>{cms.site.name}</span>
							</Link>
							<a href={`mailto:${cms.site.email}`} className={styles.email}>
								<span data-cms="site.email">{cms.site.email}</span>
							</a>
							<a href={phoneHref(cms.site.phoneDisplay)} className={styles.phone}>
								<span data-cms="site.phoneDisplay">{cms.site.phoneDisplay}</span>
							</a>
							<ul className={styles.social}>
								{brandSocial.map(({ href, label, Icon }) => (
									<li key={label}>
										<a
											href={label === "Google" ? googleMapsUrl : href}
											className={styles.socialLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Icon
												className={
													label === "BBB"
														? `${styles.socialIcon} ${styles.socialIconBbb}`
														: styles.socialIcon
												}
											/>
											<span className={shared.visuallyHidden}>{label}</span>
										</a>
									</li>
								))}
							</ul>
						</div>

						<nav className={styles.col} aria-label="Services">
							<p className={styles.colTitle}>Services</p>
							<ul className={styles.colList}>
								{services.map((category) => (
									<li key={category.id}>
										<Link href={`/services/${category.slug}`} className={styles.colLink}>
											{category.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<nav className={styles.col} aria-label="Areas">
							<p className={styles.colTitle}>Areas</p>
							<ul className={styles.colList}>
								<li>
									<Link href="/areas" className={styles.colLink}>
										Service Areas
									</Link>
								</li>
								{regions.map((region) => (
									<li key={region.id}>
										<HashLink
											href={`/?area=${region.id}#areas`}
											className={styles.colLink}
											onClick={() => selectArea({ regionId: region.id, cityId: null })}
										>
											{region.label}
										</HashLink>
									</li>
								))}
							</ul>
						</nav>

						<nav className={styles.col} aria-label="Deals">
							<p className={styles.colTitle}>Deals</p>
							<ul className={styles.colList}>
								{deals.map((deal) => (
									<li key={deal.id}>
										<Link href={`/deals#${deal.id}`} className={styles.colLink}>
											{deal.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<nav className={styles.col} aria-label="Content">
							<p className={styles.colTitle}>Content</p>
							<ul className={styles.colList}>
								<li>
									<Link href="/blog" className={styles.colLink}>
										Blog
									</Link>
								</li>
								<li>
									<HashLink href="/#works" className={styles.colLink}>
										Projects
									</HashLink>
								</li>
							</ul>
						</nav>

						<nav className={`${styles.col} ${styles.infoCol}`} aria-label="Info">
							<p className={styles.colTitle}>Info</p>
							<ul className={styles.colList}>
								<li>
									<HashLink href="/#faq" className={styles.colLink}>
										FAQ
									</HashLink>
								</li>
								<li>
									<Link href="/privacy-policy" className={styles.colLink}>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link href="/messaging-terms" className={styles.colLink}>
										Messaging Terms
									</Link>
								</li>
							</ul>
						</nav>
					</div>
					<BbbSeal className={styles.bbbSealDesktop} />
					<div className={styles.bottom}>
						<div className={styles.bottomRow}>
							<p className={styles.copy}>
								© {new Date().getFullYear()}{" "}
								<span data-cms="site.legalName">{cms.site.legalName || cms.site.name}</span>, All Rights Reserved
							</p>
							<div className={styles.bottomAside}>
								<p className={styles.meta}>
									<span>Southern California</span>
									{" · "}
									<span data-cms="site.availability">{cms.site.availability || "Available 24/7"}</span>
								</p>
								<BbbSeal className={styles.bbbSealMobile} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
