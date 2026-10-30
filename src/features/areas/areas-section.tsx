"use client";

import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  areaMapSrc,
  areaMapsLink,
  defaultAreaRegionId,
  serviceAreas,
  type AreaRegion,
} from "./areas";
import styles from "./areas.module.css";

type Selection = {
  regionId: string;
  cityId: string | null;
};

const storageKeyDefault = "primefix.areas";
const mobileCityLimit = 10;

function readSelection(storageKey: string, regions: AreaRegion[]): Selection | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Selection>;
    const region = regions.find((item) => item.id === parsed.regionId);
    if (!region) return null;
    const cityId = region.cities.some((city) => city.id === parsed.cityId) ? parsed.cityId ?? null : null;
    return { regionId: region.id, cityId };
  } catch {
    return null;
  }
}

export function AreasSection({
  id = "service-areas",
  storageKey = storageKeyDefault,
  regions = serviceAreas,
  headingLead = "Areas we",
  headingAccent = "serve",
}: {
  id?: string;
  storageKey?: string;
  regions?: AreaRegion[];
  headingLead?: string;
  headingAccent?: string;
}) {
  const fallbackId = regions.some((region) => region.id === defaultAreaRegionId) ? defaultAreaRegionId : regions[0]?.id ?? "";
  const [selection, setSelection] = useState<Selection>({ regionId: fallbackId, cityId: null });
  const [ready, setReady] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const cityPanelRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef(selection);
  selectionRef.current = selection;

  useEffect(() => {
    const stored = readSelection(storageKey, regions);
    if (stored) setSelection(stored);
    setReady(true);
  }, [regions, storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(selection));
    } catch {
      // Private browsing can block storage. The choice still applies for this visit.
    }
  }, [ready, selection, storageKey]);

  useEffect(() => {
    if (!ready) return;
    const current = regions.find((item) => item.id === selectionRef.current.regionId);
    const index = current?.cities.findIndex((item) => item.id === selectionRef.current.cityId) ?? -1;
    setShowAll(index >= mobileCityLimit);
    cityPanelRef.current?.scrollTo({ top: 0 });
  }, [ready, regions, selection.regionId]);

  const region = regions.find((item) => item.id === selection.regionId) ?? regions[0];
  if (!region) return null;
  const city = region.cities.find((item) => item.id === selection.cityId) ?? null;
  const place = city ?? region;
  const zoom = city ? 13 : region.zoom;
  const mapKey = `${place.lat},${place.lng},${zoom}`;

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <h2 id={`${id}-heading`} className={styles.heading}>
          {headingLead} <span className={styles.accent}>{headingAccent}</span>
        </h2>
        <div className={styles.shell}>
          <div className={styles.mapCard}>
            <iframe
              key={mapKey}
              className={styles.map}
              title={`Map of ${city?.label ?? region.label}`}
              src={areaMapSrc(place.lat, place.lng, zoom)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className={styles.mapLink} href={areaMapsLink(city?.query ?? region.query)} target="_blank" rel="noreferrer">
              <ExternalLink size={14} aria-hidden="true" />
              Open in Maps
            </a>
          </div>
          <div className={styles.regions} role="group" aria-label="Regions">
            {regions.map((item) => {
              const selected = item.id === region.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.region}
                  aria-pressed={selected}
                  onClick={() => setSelection({ regionId: item.id, cityId: null })}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div ref={cityPanelRef} className={styles.cityPanel} data-open={showAll ? "true" : "false"}>
            <ul className={styles.cities}>
              {region.cities.map((item, index) => {
                const selected = item.id === city?.id;
                return (
                  <li key={item.id} className={index >= mobileCityLimit ? styles.cityExtra : undefined}>
                    <button
                      type="button"
                      className={styles.city}
                      aria-pressed={selected}
                      onClick={() => setSelection({ regionId: region.id, cityId: item.id })}
                    >
                      <MapPin size={16} aria-hidden="true" />
                      <span>{item.label}</span>
                      <ChevronRight size={16} aria-hidden="true" className={styles.chevron} />
                    </button>
                  </li>
                );
              })}
            </ul>
            {region.cities.length > mobileCityLimit ? (
              <button
                type="button"
                className={styles.more}
                aria-expanded={showAll}
                onClick={() => setShowAll((open) => !open)}
              >
                {showAll ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
