"use client";

import { useEffect } from "react";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";

export function RedirectHash({ hash, label }: { hash: string; label: string }) {
	const id = hash.replace(/^#/, "");
	const href = `${assetPath("/")}#${id}`;

	useEffect(() => {
		window.location.replace(href);
	}, [href]);

	return (
		<main id="content" className={shared.pageContent}>
			<a href={href}>{label}</a>
		</main>
	);
}
