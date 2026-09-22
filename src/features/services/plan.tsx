"use client";

import { useState } from "react";
import { TvQuoteForm } from "@/features/quote";
import { tvCounts, type TvCountId } from "@/lib/services";
import shared from "@/styles/shared.module.css";
import styles from "./plan.module.css";

export function Plan() {
  const [selected, setSelected] = useState<TvCountId | null>(null);
  const current = tvCounts.find((item) => item.id === selected);

  return (
    <section
      id="plan"
      aria-labelledby="plan-heading"
      className={styles.section}
    >
      <div className={styles.container}>
        <h2
          id="plan-heading"
          className={styles.heading}
        >
          How many TVs do you need mounted?
        </h2>

        <fieldset className={styles.field}>
          <legend className={shared.visuallyHidden}>Number of televisions to mount</legend>
          <div
            className={styles.track}
            aria-hidden="true"
          />
          <div
            className={styles.fill}
            aria-hidden="true"
            style={{
              width:
                selected === "2"
                  ? "25%"
                  : selected === "3"
                    ? "50%"
                    : selected === "4plus"
                      ? "75%"
                      : "0%",
            }}
          />

          <div className={styles.options}>
            {tvCounts.map((item, index) => (
              <label
                key={item.id}
                className={styles.option}
              >
                <input
                  id={`count-${item.id}`}
                  type="radio"
                  name="tv-count"
                  value={item.id}
                  checked={selected === item.id}
                  onChange={() => setSelected(item.id)}
                  className={shared.visuallyHidden}
                />
                <span className={styles.index}>
                  <span className={styles.dot} />
                  <span className={styles.indexText}>
                    0{index + 1}
                  </span>
                </span>
                <span className={styles.count}>
                  {item.count}
                </span>
                <TvMarks count={item.screens} />
                <span className={styles.title}>{item.title}</span>
                <span className={styles.note}>
                  {item.note}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {current ? (
          <div className={styles.selection}>
            <div className={styles.selectionCopy}>
              <p className={styles.selectionTitle}>
                {current.title}
              </p>
            </div>
            <div className={styles.selectionForm}>
              <TvQuoteForm tvCount={current.id} />
            </div>
          </div>
        ) : (
          <p className={styles.empty}>
            Select a count to continue with wall type, concealment, and a photo of the wall.
          </p>
        )}
      </div>
    </section>
  );
}

function TvMarks({ count }: { readonly count: number }) {
  const screens = count === 4 ? 3 : count;
  return (
    <span className={styles.marks} aria-hidden="true">
      {Array.from({ length: screens }, (_, index) => (
        <span
          key={index}
          className={styles.screen}
        />
      ))}
      {count === 4 ? (
        <span className={styles.plus}>
          +
        </span>
      ) : null}
    </span>
  );
}
