"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Trash2, X } from "lucide-react";
import styles from "../admin.module.css";

type Status = "new" | "contacted" | "scheduled";

type ApplicationForm = "book" | "signup" | "tv";

type Application = {
  id: string;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  status: Status;
  form: ApplicationForm;
  details: Record<string, string>;
  photos: { index: number; name: string }[];
};

const tabs: { id: ApplicationForm; label: string }[] = [
  { id: "book", label: "Book now" },
  { id: "signup", label: "Sign up" },
  { id: "tv", label: "TV" },
];

const PAGE_SIZE = 20;

export default function ApplicationsPage() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [items, setItems] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tab, setTab] = useState<ApplicationForm>("book");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewer, setViewer] = useState<{ photos: { src: string; alt: string }[]; index: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.json())
      .then((body: { authenticated?: boolean }) => {
        setAuthenticated(body.authenticated === true);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/applications")
      .then(async (response) => {
        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }
        if (!response.ok) throw new Error("Could not load applications.");
        const body = (await response.json()) as { items?: Application[] };
        setItems((body.items ?? []).map(normalize));
        setLoaded(true);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Could not load applications.");
        setLoaded(true);
      });
  }, [authenticated]);

  const filtered = useMemo(() => {
    const start = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const end = to ? new Date(`${to}T23:59:59.999`).getTime() : null;
    const next = items.filter((item) => {
      const time = new Date(item.submittedAt).getTime();
      if (Number.isNaN(time)) return false;
      if (start !== null && time < start) return false;
      if (end !== null && time > end) return false;
      return true;
    });
    next.sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime());
    return next.filter((item) => item.form === tab);
  }, [items, from, to, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const pending = items.find((item) => item.id === confirmId) ?? null;

  async function changeStatus(id: string, status: Status) {
    const previous = items;
    setError("");
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) {
      setItems(previous);
      setError("Could not update the status.");
    }
  }

  async function remove(id: string) {
    setDeleting(true);
    setError("");
    const response = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) {
      setError("Could not delete the application.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    setConfirmId(null);
    if (visible.length === 1 && currentPage > 1) setPage(currentPage - 1);
  }

  if (!ready) return <main className={styles.login}>Loading…</main>;
  if (!authenticated) {
    return (
      <Login
        onSuccess={() => {
          setLoaded(false);
          setError("");
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <main className={styles.applications}>
      <div className={styles.applicationsInner}>
        <h1>Applications</h1>
        <div className={styles.tabs} role="tablist" aria-label="Application forms">
          {tabs.map((item) => {
            const count = items.filter((entry) => entry.form === item.id).length;
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? styles.tabActive : styles.tab}
                onClick={() => {
                  setTab(item.id);
                  setPage(1);
                }}
              >
                {item.label}
                <span>{count}</span>
              </button>
            );
          })}
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        {!loaded ? <p className={styles.empty}>Loading…</p> : null}
        {loaded && !error ? (
          <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
            <label>
              <span>From</span>
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label>
              <span>To</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => {
                  setTo(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <button
              type="button"
              disabled={!from && !to}
              onClick={() => {
                setFrom("");
                setTo("");
                setPage(1);
              }}
            >
              Clear Sorting
            </button>
          </form>
        ) : null}
        {loaded && !error && filtered.length === 0 ? (
          <p className={styles.empty}>
            {items.some((item) => item.form === tab) ? "No applications in this date range." : "No applications yet."}
          </p>
        ) : null}
        {visible.length > 0 ? (
          <div className={styles.board}>
            <div className={styles.head} aria-hidden="true">
              <span>Date</span>
              <span>Name</span>
              <span>Phone</span>
              <span>Email</span>
              <span>ZIP</span>
              <span>Service</span>
              <span>Photos</span>
              <span>Status</span>
              <span />
            </div>
            <ul className={styles.rows}>
              {visible.map((item) => {
                const when = formatWhen(item.submittedAt);
                return (
                  <li key={item.id} className={styles.row}>
                    <div className={`${styles.cell} ${styles.dateCell}`}>
                      <span className={styles.cellLabel}>Date</span>
                      <span className={styles.value}>
                        <span className={styles.valueText}>
                          {when.date}
                          {when.time ? <span className={styles.time}>{when.time}</span> : null}
                        </span>
                        <CopyButton value={when.copy} label={`Copy date for ${item.name}`} />
                      </span>
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Name</span>
                      <span className={styles.valueText}>{item.name}</span>
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Phone</span>
                      <span className={styles.value}>
                        {telHref(item.phone) ? (
                          <a className={styles.valueText} href={telHref(item.phone)}>
                            {item.phone}
                          </a>
                        ) : (
                          <span className={styles.valueText}>{item.phone}</span>
                        )}
                        <CopyButton value={item.phone} label={`Copy phone for ${item.name}`} />
                      </span>
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Email</span>
                      {item.email ? (
                        <span className={styles.value}>
                          {mailHref(item.email) ? (
                            <a className={styles.valueText} href={mailHref(item.email)}>
                              {item.email}
                            </a>
                          ) : (
                            <span className={styles.valueText}>{item.email}</span>
                          )}
                          <CopyButton value={item.email} label={`Copy email for ${item.name}`} />
                        </span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>ZIP</span>
                      <span>{item.zip || "—"}</span>
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Service</span>
                      {item.service ? <span>{item.service}</span> : <span className={styles.muted}>Not specified</span>}
                      {formatDetails(item) ? <span className={styles.detail}>{formatDetails(item)}</span> : null}
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Photos</span>
                      {item.photos.length > 0 ? (
                        <ul className={styles.thumbs}>
                          {item.photos.map((photo, position) => (
                            <li key={photo.index}>
                              <button
                                type="button"
                                className={styles.thumb}
                                aria-label={`View photo ${position + 1} from ${item.name}`}
                                onClick={() =>
                                  setViewer({
                                    index: position,
                                    photos: item.photos.map((entry) => ({
                                      src: `/api/admin/applications/${item.id}/photos/${entry.index}`,
                                      alt: entry.name,
                                    })),
                                  })
                                }
                              >
                                <img src={`/api/admin/applications/${item.id}/photos/${photo.index}`} alt="" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className={styles.muted}>No photos</span>
                      )}
                    </div>
                    <div className={styles.cell}>
                      <span className={styles.cellLabel}>Status</span>
                      <select
                        className={styles.status}
                        data-status={item.status}
                        aria-label={`Status for ${item.name}`}
                        value={item.status}
                        onChange={(event) => changeStatus(item.id, event.target.value as Status)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.trash}
                        aria-label={`Delete application from ${item.name}`}
                        onClick={() => setConfirmId(item.id)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {loaded && !error && filtered.length > PAGE_SIZE ? (
          <nav className={styles.pager} aria-label="Application pages">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              Previous
            </button>
            <p>
              {startIndex + 1}–{startIndex + visible.length} of {filtered.length}
            </p>
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
              Next
            </button>
          </nav>
        ) : null}
      </div>
      {viewer ? (
        <PhotoViewer
          photos={viewer.photos}
          index={Math.min(viewer.index, viewer.photos.length - 1)}
          onIndex={(index) => setViewer((current) => (current ? { ...current, index } : current))}
          onClose={() => setViewer(null)}
        />
      ) : null}
      {pending ? (
        <ConfirmDelete
          name={pending.name}
          pending={deleting}
          onCancel={() => {
            if (!deleting) setConfirmId(null);
          }}
          onConfirm={() => remove(pending.id)}
        />
      ) : null}
    </main>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={styles.copy} aria-label={copied ? "Copied" : label} onClick={copy}>
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </button>
  );
}

function PhotoViewer({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: { src: string; alt: string }[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onIndexRef = useRef(onIndex);
  const indexRef = useRef(index);
  const photo = photos[index];

  useEffect(() => {
    onCloseRef.current = onClose;
    onIndexRef.current = onIndex;
    indexRef.current = index;
  }, [onClose, onIndex, index]);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (photos.length < 2) return;
      if (event.key === "ArrowRight") onIndexRef.current((indexRef.current + 1) % photos.length);
      if (event.key === "ArrowLeft") onIndexRef.current((indexRef.current - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [photos.length]);

  if (!photo) return null;

  return (
    <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={photo.alt || "Photo"} onClick={onClose}>
      <button ref={closeRef} type="button" className={styles.viewerClose} aria-label="Close photo" onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </button>
      <img src={photo.src} alt={photo.alt} onClick={(event) => event.stopPropagation()} />
      {photos.length > 1 ? (
        <>
          <button
            type="button"
            className={styles.viewerPrevious}
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index - 1 + photos.length) % photos.length);
            }}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.viewerNext}
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index + 1) % photos.length);
            }}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}

function ConfirmDelete({
  name,
  pending,
  onCancel,
  onConfirm,
}: {
  name: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancelRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.confirmRoot} onClick={onCancel}>
      <div
        className={styles.confirm}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-application-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-application-title">Delete this application?</h2>
        <p>{name} will be removed from the list.</p>
        <div className={styles.confirmActions}>
          <button ref={cancelRef} type="button" className={styles.cancel} onClick={onCancel} disabled={pending}>
            Cancel
          </button>
          <button type="button" className={styles.remove} onClick={onConfirm} disabled={pending}>
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "That password is not correct.");
      setPending(false);
      return;
    }
    onSuccess();
  }

  return (
    <main className={styles.login}>
      <form className={styles.loginCard} onSubmit={onSubmit}>
        <p className={styles.brand}>PrimeFix</p>
        <h1>Sign in</h1>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.save} type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>
    </main>
  );
}

function normalize(item: Application): Application {
  const status = item.status === "contacted" || item.status === "scheduled" ? item.status : "new";
  const form = item.form === "signup" || item.form === "tv" ? item.form : "book";
  const details: Record<string, string> = {};
  if (item.details && typeof item.details === "object") {
    for (const [key, value] of Object.entries(item.details)) {
      if (typeof value === "string" && value.trim()) details[key] = value.trim();
    }
  }
  return { ...item, status, form, details };
}

const detailLabels: Record<string, string> = {
  hearAbout: "Heard via",
  tvCount: "TVs",
  offer: "Offer",
  room: "Room",
  mount: "Mount",
  wall: "Wall",
  size: "Size",
  tvSize: "Size",
  wallType: "Wall",
  hasMount: "Has mount",
  mountType: "Mount",
  concealment: "Cables",
};

function formatDetails(item: Application) {
  const hidden = new Set(["name", "phone", "email", "zip", "service"]);
  return Object.entries(item.details)
    .filter(([key, value]) => !hidden.has(key) && value && value !== item.service)
    .map(([key, value]) => `${detailLabels[key] ?? key}: ${value}`)
    .join(" · ");
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: "", copy: value };
  return {
    date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date),
    copy: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date),
  };
}

function telHref(phone: string) {
  const safe = phone.replace(/[^\d+]/g, "");
  return safe ? `tel:${safe}` : "";
}

function mailHref(email: string) {
  if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)) return "";
  return `mailto:${encodeURIComponent(email)}`;
}
