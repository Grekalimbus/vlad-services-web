"use client";

import Image from "next/image";
import { CalendarClock, ClipboardList, CreditCard, Phone, type LucideIcon } from "lucide-react";
import { AreasSection } from "@/features/areas";
import { FaqSection } from "@/features/faq/faq-section";
import { PhotoFeature } from "./category-gallery";
import { useQuote } from "@/features/quote";
import { electricalLandingFrom } from "@/lib/cms/electrical-landing";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./electrician-landing.module.css";

const stepIcons: LucideIcon[] = [ClipboardList, Phone, CalendarClock, CreditCard];

type Photo = {
  image: string;
  alt: string;
  title?: string;
};

export function ElectricianLanding({
  category,
  namePath,
  photos,
  galleryPath,
}: {
  category: { id: string; name: string; coverImage?: string };
  namePath?: string;
  photos: Photo[];
  galleryPath: string;
}) {
  const cms = useCms();
  const landing = electricalLandingFrom(cms);
  const coverIndex = cms.copy.home.serviceCovers.findIndex((item) => item.id === category.id);
  const cover = coverIndex >= 0 ? cms.copy.home.serviceCovers[coverIndex] : undefined;
  const figureSrc = cover?.src || category.coverImage || "";
  const { openQuote } = useQuote();

  return (
    <>
      <ul className={styles.iconRow}>
        {landing.icons.map((icon, index) => (
          <li key={`${icon.src}-${index}`}>
            <button
              type="button"
              className={styles.iconButton}
              data-cms-card={`serviceIcon:${category.id}:${index}`}
              aria-label={`${icon.text}. Book ${category.name.trim()}`}
              onClick={() => openQuote("quote", undefined, category.name)}
            >
              <img
                src={assetPath(icon.src)}
                alt=""
                width={88}
                height={88}
                className={styles.iconImage}
              />
              <span className={styles.iconLabel} data-cms={`copy.serviceLanding.${category.id}.icons.${index}.text`}>
                {icon.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <section className={styles.story} data-side="start" aria-labelledby="electrical-story-title">
        {figureSrc ? (
          <figure className={styles.figure}>
            <Image
              src={assetPath(figureSrc)}
              alt={landing.description.imageAlt}
              data-cms-src={coverIndex >= 0 ? `copy.home.serviceCovers.${coverIndex}.src` : undefined}
              width={1672}
              height={940}
              unoptimized={figureSrc.startsWith("/api/media/")}
              sizes="(min-width: 800px) 36rem, 100vw"
              className={styles.storyImage}
            />
          </figure>
        ) : null}
        <div className={styles.storyCopy}>
          <h1 id="electrical-story-title" className={styles.storyTitle} data-cms="copy.serviceLanding.electrical.description.title">
            {landing.description.title}
          </h1>
          <div className={styles.storyBody} data-cms="copy.serviceLanding.electrical.description.body">
            {paragraphs(landing.description.body)}
          </div>
        </div>
      </section>
      <section className={styles.quiz} aria-labelledby="after-quiz-heading">
        <h2 id="after-quiz-heading" className={styles.quizHeading} data-cms="copy.serviceLanding.electrical.stepsHeading">
          <QuizHeading text={landing.stepsHeading} />
        </h2>
        <ol className={styles.steps}>
          {landing.steps.map((step, index) => {
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
                    <h3 className={styles.stepTitle} data-cms={`copy.serviceLanding.electrical.steps.${index}.title`}>
                      {step.title}
                    </h3>
                    <p className={styles.stepText} data-cms={`copy.serviceLanding.electrical.steps.${index}.text`}>
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <PhotoFeature
        name={category.name}
        namePath={namePath}
        slides={photos}
        galleryPath={galleryPath}
        compact
        body={landing.dealsBody}
        bodyPath="copy.serviceLanding.electrical.dealsBody"
      />
      <FaqSection
        id="electrical-faq"
        headingId="electrical-faq-heading"
        headingLead={landing.faq.headingLead}
        headingAccent={landing.faq.headingAccent}
        items={landing.faq.items}
        paths={{
          headingLead: "copy.serviceLanding.electrical.faq.headingLead",
          headingAccent: "copy.serviceLanding.electrical.faq.headingAccent",
          item: (index, field) => `copy.serviceLanding.electrical.faq.items.${index}.${field}`,
        }}
      />
      <AreasSection id="areas" />
    </>
  );
}

function QuizHeading({ text }: { text: string }) {
  const match = text.match(/^(.*?)(\bquiz\b)(.*)$/i);
  if (!match) return text;
  return (
    <>
      {match[1]}
      <span className={styles.quizWord}>{match[2]}</span>
      {match[3]}
    </>
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => <p key={block.slice(0, 32)}>{block}</p>);
}
