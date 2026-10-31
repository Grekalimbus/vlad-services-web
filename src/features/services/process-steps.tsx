"use client";

import { CalendarClock, ClipboardList, CreditCard, Phone, type LucideIcon } from "lucide-react";
import { useQuote } from "@/features/quote";
import styles from "./electrician-landing.module.css";

const stepIcons: LucideIcon[] = [ClipboardList, Phone, CalendarClock, CreditCard];

export function ProcessSteps({
  steps,
  serviceName,
  pathFor,
}: {
  steps: { title: string; text: string }[];
  serviceName: string;
  pathFor: (index: number, field: "title" | "text") => string;
}) {
  const { openQuote } = useQuote();

  return (
    <section className={styles.quiz}>
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
      <button type="button" className={styles.quote} onClick={() => openQuote("quote", undefined, serviceName)}>
        GET A QUOTE
      </button>
    </section>
  );
}
