"use client";

import { CalendarClock, ClipboardList, CreditCard, Phone, type LucideIcon } from "lucide-react";
import { useQuote } from "@/features/quote";
import styles from "./electrician-landing.module.css";

const stepIcons: LucideIcon[] = [ClipboardList, Phone, CalendarClock, CreditCard];

export function GetQuoteButton({
  serviceName,
  tight = false,
}: {
  serviceName: string;
  tight?: boolean;
}) {
  const { openQuote } = useQuote();

  return (
    <button
      type="button"
      className={tight ? `${styles.quote} ${styles.quoteTight}` : styles.quote}
      onClick={() => openQuote("quote", undefined, serviceName)}
    >
      GET A QUOTE
    </button>
  );
}

export function ProcessSteps({
  steps,
  pathFor,
  tightTop = false,
}: {
  steps: { title: string; text: string }[];
  serviceName?: string;
  pathFor: (index: number, field: "title" | "text") => string;
  tightTop?: boolean;
}) {
  return (
    <section className={tightTop ? `${styles.quiz} ${styles.quizTightTop}` : styles.quiz}>
      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const Icon = stepIcons[index] ?? ClipboardList;
          return (
            <li key={`${step.title}-${index}`} className={styles.step}>
              <span className={styles.stepIndex} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepCard}>
                <span className={styles.stepIcon} aria-hidden="true">
                  <Icon strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className={styles.stepTitle} data-cms={pathFor(index, "title")}>
                    {step.title}
                  </h3>
                  <p className={styles.stepText} data-cms={pathFor(index, "text")}>
                    {step.text}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
