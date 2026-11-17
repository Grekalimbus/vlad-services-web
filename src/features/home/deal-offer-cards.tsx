"use client";

import { Check, ChevronDown, Fan, Flower2, Home, Layers, Plug, TreePine, Tv, Wrench } from "lucide-react";
import { useState } from "react";
import {
	addDealOfferCard,
	addDealOfferListItem,
	moveDealOfferCard,
	removeDealOfferListItem,
} from "@/features/editor/deal-actions";
import { useQuote } from "@/features/quote";
import type { DealOfferCard } from "@/lib/cms/deals-page";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import styles from "./deal-offer-cards.module.css";

function display(value: string) {
	return value.trim() || "—";
}

function dealOptionLabel(card: DealOfferCard) {
	const category = card.category.trim();
	const offer = card.offer.trim();
	if (category && offer) return `${toTitleCase(category)} (${offer})`;
	return category || offer || card.subtitle.trim() || "Deal";
}

function toTitleCase(value: string) {
	return value
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => {
			if (word === "tv") return "TV";
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

function OfferIcon({ name }: { name: string }) {
	const props = { size: 22, strokeWidth: 2.1, "aria-hidden": true as const };
	if (name === "fan") return <Fan {...props} />;
	if (name === "plug") return <Plug {...props} />;
	if (name === "smart") return <Home {...props} />;
	if (name === "tv") return <Tv {...props} />;
	if (name === "wrench") return <Wrench {...props} />;
	if (name === "leaf") return <Flower2 {...props} />;
	if (name === "tree") return <TreePine {...props} />;
	return <Layers {...props} />;
}

export function DealOfferCards({
	dealIndex,
	cards,
	serviceSlug = "",
}: {
	dealIndex: number;
	cards: DealOfferCard[];
	serviceSlug?: string;
}) {
	const editing = useEditing();
	const cms = useCms();
	const { openQuote } = useQuote();
	const [open, setOpen] = useState<Record<string, boolean>>({});
	const show = cards.length > 0 || editing;
	const dealOptions = cards.map((card, offerIndex) => ({
		id: card.id || `${dealIndex}-${offerIndex}`,
		label: dealOptionLabel(card),
	}));
	const serviceName =
		cms.serviceCategories.find((item) => item.slug === serviceSlug || item.id === serviceSlug)?.name?.trim() ||
		"";

	if (!show) return null;

	function requestDeal(offerIndex: number) {
		const card = cards[offerIndex];
		if (!card) return;
		const selectedOfferId = card.id || `${dealIndex}-${offerIndex}`;
		openQuote({
			service: serviceName,
			dealQuote: {
				selectedOfferId,
				offers: dealOptions,
			},
		});
	}

	return (
		<div className={styles.wrap}>
			<ul className={styles.list}>
				{cards.map((card, offerIndex) => {
					const key = card.id || `${dealIndex}-${offerIndex}`;
					const isOpen = Boolean(open[key]);
					return (
						<li key={key}>
							<article
								className={isOpen ? `${styles.card} ${styles.cardOpen}` : styles.card}
								data-cms-card={`dealOffer:${dealIndex}:${offerIndex}`}
							>
								<button
									type="button"
									className={styles.toggle}
									aria-expanded={isOpen}
									onClick={() => setOpen((current) => ({ ...current, [key]: !current[key] }))}
								>
									<span className={styles.icon}>
										<OfferIcon name={card.icon} />
									</span>
									<span className={styles.copy}>
										<p className={styles.category} data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.category`}>
											{display(card.category)}
										</p>
										<p className={styles.offer} data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.offer`}>
											{display(card.offer)}
										</p>
										<p className={styles.subtitle} data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.subtitle`}>
											{display(card.subtitle)}
										</p>
										<p
											className={styles.description}
											data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.description`}
										>
											{display(card.description)}
										</p>
									</span>
									<ChevronDown className={styles.chevron} size={22} strokeWidth={2.2} aria-hidden="true" />
								</button>

								{!isOpen ? (
									<p className={styles.disclaimer}>
										<span
											className={styles.disclaimerTitle}
											data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.disclaimerTitle`}
										>
											{display(card.disclaimerTitle)}
										</span>
										<span className={styles.disclaimerDot} aria-hidden="true">
											•
										</span>
										<span
											className={styles.disclaimerText}
											data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.disclaimerText`}
										>
											{display(card.disclaimerText)}
										</span>
									</p>
								) : null}

								<div className={styles.panel} aria-hidden={!isOpen}>
									<div className={styles.panelInner}>
										<div className={styles.expanded}>
											{card.detail.trim() || editing ? (
												<p
													className={styles.detail}
													data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.detail`}
												>
													{display(card.detail)}
												</p>
											) : null}
											<div className={styles.expandedGrid}>
												<div className={styles.listBlock}>
													<p
														className={styles.listTitle}
														data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.listTitle`}
													>
														{display(card.listTitle)}
													</p>
													<ul className={styles.services}>
														{(card.listItems.length ? card.listItems : [""]).map((item, itemIndex) => (
															<li key={`${key}-item-${itemIndex}`} className={styles.service}>
																<Check className={styles.check} size={16} strokeWidth={2.5} aria-hidden="true" />
																<span
																	data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.listItems.${itemIndex}`}
																>
																	{display(item)}
																</span>
																{editing ? (
																	<button
																		type="button"
																		className={styles.tool}
																		data-editor-ui
																		onClick={(event) => {
																			event.stopPropagation();
																			removeDealOfferListItem(dealIndex, offerIndex, itemIndex);
																		}}
																	>
																		Remove
																	</button>
																) : null}
															</li>
														))}
													</ul>
													{editing ? (
														<button
															type="button"
															className={styles.tool}
															data-editor-ui
															onClick={(event) => {
																event.stopPropagation();
																addDealOfferListItem(dealIndex, offerIndex);
															}}
														>
															Add service
														</button>
													) : null}
												</div>
												<div className={styles.ctaCol}>
													<p className={styles.disclaimerTitle} style={{ margin: 0 }}>
														<span data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.disclaimerTitle`}>
															{display(card.disclaimerTitle)}
														</span>
													</p>
													<p
														className={styles.disclaimerText}
														data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.disclaimerText`}
														style={{ margin: 0 }}
													>
														{display(card.disclaimerText)}
													</p>
													{card.extra.trim() || editing ? (
														<p
															className={styles.extra}
															data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.extra`}
														>
															{display(card.extra)}
														</p>
													) : null}
													<button
														type="button"
														className={styles.dealButton}
														onClick={(event) => {
															event.stopPropagation();
															requestDeal(offerIndex);
														}}
													>
														<span data-cms={`copy.dealsPage.items.${dealIndex}.offerCards.${offerIndex}.buttonLabel`}>
															{display(card.buttonLabel || "GET DEAL")}
														</span>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>

								{editing ? (
									<div className={styles.toolbar} data-editor-ui>
										<button
											type="button"
											className={styles.tool}
											disabled={offerIndex === 0}
											onClick={() => moveDealOfferCard(dealIndex, offerIndex, offerIndex - 1)}
										>
											Move up
										</button>
										<button
											type="button"
											className={styles.tool}
											disabled={offerIndex >= cards.length - 1}
											onClick={() => moveDealOfferCard(dealIndex, offerIndex, offerIndex + 1)}
										>
											Move down
										</button>
										<button
											type="button"
											className={styles.tool}
											onClick={() => setOpen((current) => ({ ...current, [key]: !current[key] }))}
										>
											{isOpen ? "Preview closed" : "Preview open"}
										</button>
									</div>
								) : null}
							</article>
						</li>
					);
				})}
			</ul>

			{editing ? (
				<button type="button" className={styles.add} data-editor-ui onClick={() => addDealOfferCard(dealIndex)}>
					Add offer card
				</button>
			) : null}
		</div>
	);
}
