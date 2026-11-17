"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  FORM_TAB_LABELS,
  formIdLabel,
  formatDetailValue,
  formatTvCount,
  partitionDetails,
  type ApplicationForm as DisplayForm,
} from "@/lib/application-display";
import { HearAboutIcon } from "@/shared/hear-about-icon";
import { ServiceIcon } from "@/shared/service-icon";
import styles from "../admin.module.css";

type Status = "new" | "contacted" | "scheduled";
type ApplicationForm = "book" | "signup" | "tv";

type ApplicationConsents = {
  privacyPolicy: "accepted" | "na";
  smsMarketing: "yes" | "no" | "na";
  emailMarketing: "yes" | "no" | "na";
  submittedAt: string;
  smsText: string | null;
  emailText: string | null;
  smsGrantedAt: string | null;
  emailGrantedAt: string | null;
};

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
  consents: ApplicationConsents | null;
};

type TabId = "all" | ApplicationForm;
type StatusFilter = "all" | Status;

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: FORM_TAB_LABELS.book },
  { id: "signup", label: FORM_TAB_LABELS.signup },
  { id: "tv", label: FORM_TAB_LABELS.tv },
];

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "scheduled", label: "Scheduled" },
];

const PAGE_SIZE = 20;

export default function ApplicationsPage() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [items, setItems] = useState<Application[]>([]);
  const [quizStepLabels, setQuizStepLabels] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tab, setTab] = useState<TabId>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ photos: { src: string; alt: string }[]; index: number } | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement | null>(null);

  async function loadApplications(options?: { silent?: boolean }) {
    const silent = options?.silent === true;
    try {
      const response = await fetch("/api/admin/applications", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error("Could not load applications.");
      const body = (await response.json()) as {
        items?: Application[];
        quizStepLabels?: Record<string, string>;
      };
      setItems((body.items ?? []).map(normalize));
      setQuizStepLabels(
        body.quizStepLabels && typeof body.quizStepLabels === "object" ? body.quizStepLabels : {},
      );
      if (!silent) setError("");
    } catch (reason: unknown) {
      if (!silent) {
        setError(reason instanceof Error ? reason.message : "Could not load applications.");
      }
    } finally {
      setLoaded(true);
    }
  }

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
    void loadApplications();
    const timer = window.setInterval(() => {
      void loadApplications({ silent: true });
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [authenticated]);

  useEffect(() => {
    if (!notifyOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!notifyRef.current?.contains(event.target as Node)) setNotifyOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNotifyOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notifyOpen]);

  const filtered = useMemo(() => {
    const start = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const end = to ? new Date(`${to}T23:59:59.999`).getTime() : null;
    const next = items.filter((item) => {
      if (tab !== "all" && item.form !== tab) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      const time = new Date(item.submittedAt).getTime();
      if (Number.isNaN(time)) return false;
      if (start !== null && time < start) return false;
      if (end !== null && time > end) return false;
      return true;
    });
    next.sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime());
    return next;
  }, [items, from, to, tab, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const pending = items.find((item) => item.id === confirmId) ?? null;
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const newCounts = useMemo(() => {
    const counts = { book: 0, signup: 0, tv: 0, total: 0 };
    for (const item of items) {
      if (item.status !== "new") continue;
      counts[item.form] += 1;
      counts.total += 1;
    }
    return counts;
  }, [items]);

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
      return;
    }
    void loadApplications({ silent: true });
  }

  function openNewTab(form: ApplicationForm) {
    setTab(form);
    setStatusFilter("new");
    setPage(1);
    setNotifyOpen(false);
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
    if (selectedId === id) setSelectedId(null);
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
        <header className={styles.crmHeader}>
          <div>
            <p className={styles.crmEyebrow}>PrimeFix Admin</p>
            <h1>Applications</h1>
          </div>
          <div className={styles.notifyWrap} ref={notifyRef}>
            <button
              type="button"
              className={styles.notifyButton}
              aria-label={
                newCounts.total > 0
                  ? `${newCounts.total} new applications`
                  : "No new applications"
              }
              aria-expanded={notifyOpen}
              aria-haspopup="dialog"
              onClick={() => setNotifyOpen((open) => !open)}
            >
              <Bell size={18} strokeWidth={2.2} aria-hidden="true" />
              {newCounts.total > 0 ? (
                <span className={styles.notifyBadge}>{newCounts.total > 99 ? "99+" : newCounts.total}</span>
              ) : null}
            </button>
            {notifyOpen ? (
              <div className={styles.notifyPanel} role="dialog" aria-label="New applications">
                <div className={styles.notifyPanelHead}>
                  <strong>New leads</strong>
                  <span>{newCounts.total === 0 ? "All clear" : `${newCounts.total} waiting`}</span>
                </div>
                {newCounts.total === 0 ? (
                  <p className={styles.notifyEmpty}>No applications with status New.</p>
                ) : (
                  <ul className={styles.notifyList}>
                    {(
                      [
                        { id: "book" as const, label: FORM_TAB_LABELS.book, count: newCounts.book },
                        { id: "signup" as const, label: FORM_TAB_LABELS.signup, count: newCounts.signup },
                        { id: "tv" as const, label: FORM_TAB_LABELS.tv, count: newCounts.tv },
                      ] as const
                    ).map((entry) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={styles.notifyItem}
                          disabled={entry.count === 0}
                          onClick={() => openNewTab(entry.id)}
                        >
                          <span>{entry.label}</span>
                          <strong data-active={entry.count > 0 ? "true" : "false"}>{entry.count}</strong>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className={styles.notifyHint}>Opening this panel does not change statuses.</p>
              </div>
            ) : null}
          </div>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Application forms">
          {tabs.map((item) => {
            const count =
              item.id === "all" ? items.length : items.filter((entry) => entry.form === item.id).length;
            const selectedTab = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                className={selectedTab ? styles.tabActive : styles.tab}
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
            <label>
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setPage(1);
                }}
              >
                {statusFilters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!from && !to && statusFilter === "all"}
              onClick={() => {
                setFrom("");
                setTo("");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          </form>
        ) : null}

        {loaded && !error && filtered.length === 0 ? (
          <p className={styles.empty}>
            {items.length === 0
              ? "No applications yet."
              : tab !== "all" && !items.some((item) => item.form === tab)
                ? "No applications in this tab."
                : "No applications match the current filters."}
          </p>
        ) : null}

        {visible.length > 0 ? (
          <div className={styles.crmBoard}>
            <div className={styles.crmHead} aria-hidden="true">
              <span>Date</span>
              <span>Name</span>
              <span>Phone</span>
              <span>ZIP</span>
              <span>Service</span>
              <span>Status</span>
              <span>Signals</span>
              <span />
            </div>
            <ul className={styles.crmRows}>
              {visible.map((item) => {
                const when = formatWhen(item.submittedAt);
                const extras = countExtraDetails(item);
                return (
                  <li key={item.id} className={styles.crmRow}>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Date</span>
                      <span className={styles.crmDate}>
                        <Calendar size={14} aria-hidden="true" />
                        <span>
                          {when.date}
                          {when.time ? <span className={styles.time}>{when.time}</span> : null}
                        </span>
                      </span>
                    </div>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Name</span>
                      <span className={styles.crmName}>{item.name}</span>
                    </div>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Phone</span>
                      <span className={styles.value}>
                        {telHref(item.phone) ? (
                          <a className={styles.crmPhone} href={telHref(item.phone)}>
                            <Phone size={14} aria-hidden="true" />
                            {item.phone}
                          </a>
                        ) : (
                          <span className={styles.crmPhone}>
                            <Phone size={14} aria-hidden="true" />
                            {item.phone}
                          </span>
                        )}
                        <CopyButton value={item.phone} label={`Copy phone for ${item.name}`} />
                      </span>
                    </div>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>ZIP</span>
                      {item.zip ? (
                        <span className={styles.crmZip}>
                          <MapPin size={14} aria-hidden="true" />
                          {item.zip}
                        </span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </div>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Service</span>
                      <span className={styles.crmService}>
                        <ServiceIcon service={item.service} />
                        <span>{item.service || "Not specified"}</span>
                      </span>
                    </div>
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Status</span>
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
                    <div className={styles.crmCell}>
                      <span className={styles.crmLabel}>Signals</span>
                      <div className={styles.crmSignals}>
                        {item.photos.length > 0 ? (
                          <span className={styles.crmChip} title={`${item.photos.length} photo(s)`}>
                            <ImageIcon size={13} aria-hidden="true" />
                            {item.photos.length}
                          </span>
                        ) : null}
                        {extras > 0 ? (
                          <span className={styles.crmChipMuted} title={`${extras} extra field(s)`}>
                            <FileText size={13} aria-hidden="true" />
                            {extras}
                          </span>
                        ) : null}
                        {!item.photos.length && extras === 0 ? <span className={styles.muted}>—</span> : null}
                      </div>
                    </div>
                    <div className={styles.crmActions}>
                      <button
                        type="button"
                        className={styles.crmView}
                        aria-label={`View application from ${item.name}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <Eye size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className={styles.crmTrash}
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

      {selected ? (
        <ApplicationDetailModal
          item={selected}
          quizStepLabels={quizStepLabels}
          onClose={() => setSelectedId(null)}
          onStatus={(status) => changeStatus(selected.id, status)}
          onOpenPhotos={(index) =>
            setViewer({
              index,
              photos: selected.photos.map((entry) => ({
                src: `/api/admin/applications/${selected.id}/photos/${entry.index}`,
                alt: entry.name,
              })),
            })
          }
        />
      ) : null}

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

function ApplicationDetailModal({
  item,
  quizStepLabels,
  onClose,
  onStatus,
  onOpenPhotos,
}: {
  item: Application;
  quizStepLabels: Record<string, string>;
  onClose: () => void;
  onStatus: (status: Status) => void;
  onOpenPhotos: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const when = formatWhen(item.submittedAt);
  const parts = partitionDetails(item.details, item.service, quizStepLabels, item.form as DisplayForm);
  const formId = item.details.formId;
  const formLocation = item.details.formLocation;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const requestFields = [
    item.service ? { label: "Service", value: item.service } : null,
    ...parts.request
      .filter((entry) => entry.key !== "description" && entry.key !== "dealOffer" && entry.key !== "offer" && entry.key !== "tvCount")
      .map((entry) => ({ label: entry.label, value: entry.value })),
  ].filter(Boolean) as { label: string; value: string }[];

  const description = item.details.description;
  const deal = item.details.dealOffer;
  const offer = item.details.offer;
  const tvCount = item.details.tvCount;

  return (
    <div className={styles.detailRoot} onClick={onClose}>
      <div
        className={styles.detailModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.detailHeader}>
          <div>
            <p className={styles.crmEyebrow}>{FORM_TAB_LABELS[item.form]}</p>
            <h2 id="application-detail-title">{item.name}</h2>
          </div>
          <button ref={closeRef} type="button" className={styles.detailClose} aria-label="Close details" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.detailBody}>
          <DetailSection icon={<Phone size={16} aria-hidden="true" />} title="Contact Information">
            <DetailField label="Name" value={item.name} />
            <DetailField
              label="Phone"
              value={item.phone}
              href={telHref(item.phone)}
              copyValue={item.phone}
              icon={<Phone size={14} aria-hidden="true" />}
            />
            {item.email ? (
              <DetailField
                label="Email"
                value={item.email}
                href={mailHref(item.email)}
                copyValue={item.email}
                icon={<Mail size={14} aria-hidden="true" />}
              />
            ) : null}
            {item.zip ? (
              <DetailField label="ZIP" value={item.zip} icon={<MapPin size={14} aria-hidden="true" />} />
            ) : null}
          </DetailSection>

          {(requestFields.length > 0 || description || deal || offer || tvCount || parts.quiz.length > 0) && (
            <DetailSection
              icon={<ServiceIcon service={item.service} size={16} />}
              title="Request Details"
            >
              {item.service ? (
                <DetailField
                  label="Service"
                  value={item.service}
                  icon={<ServiceIcon service={item.service} />}
                />
              ) : null}
              {requestFields
                .filter((field) => field.label !== "Service")
                .map((field) => (
                  <DetailField key={field.label + field.value} label={field.label} value={field.value} />
                ))}
              {description ? <DetailField label="Description" value={description} /> : null}
              {deal ? <DetailField label="Deal" value={deal} /> : null}
              {offer ? <DetailField label="Offer" value={offer} /> : null}
              {tvCount ? <DetailField label="TVs" value={formatTvCount(tvCount)} /> : null}
              {parts.quiz.map((entry) => (
                <DetailField key={entry.key} label={entry.label} value={entry.value} />
              ))}
            </DetailSection>
          )}

          <DetailSection icon={<Globe size={16} aria-hidden="true" />} title="Lead Source">
            <DetailField label="Form type" value={FORM_TAB_LABELS[item.form]} />
            {formId ? <DetailField label="Form" value={formIdLabel(formId) ?? formId} /> : null}
            {formLocation ? <DetailField label="Form location" value={formLocation} /> : null}
            {item.details.sourcePage ? <DetailField label="Source page" value={item.details.sourcePage} /> : null}
            {item.details.leadSource ? <DetailField label="Lead source" value={item.details.leadSource} /> : null}
            {item.details.hearAbout ? (
              <DetailField
                label="Heard about"
                value={item.details.hearAbout}
                icon={<HearAboutIcon value={item.details.hearAbout} className={styles.hearAboutIcon} />}
              />
            ) : null}
            {parts.source
              .filter((entry) => !["formId", "formLocation", "sourcePage", "leadSource", "hearAbout"].includes(entry.key))
              .map((entry) => (
                <DetailField key={entry.key} label={entry.label} value={formatDetailValue(entry.key, entry.value)} />
              ))}
          </DetailSection>

          <DetailSection icon={<ShieldCheck size={16} aria-hidden="true" />} title="Consent & Agreements">
            <ConsentBlock consents={item.consents} submittedAt={item.submittedAt} />
          </DetailSection>

          {item.photos.length > 0 ? (
            <DetailSection icon={<ImageIcon size={16} aria-hidden="true" />} title="Attachments">
              <ul className={styles.thumbs}>
                {item.photos.map((photo, position) => (
                  <li key={photo.index}>
                    <button
                      type="button"
                      className={styles.thumb}
                      aria-label={`View photo ${position + 1} from ${item.name}`}
                      onClick={() => onOpenPhotos(position)}
                    >
                      <img src={`/api/admin/applications/${item.id}/photos/${photo.index}`} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          <DetailSection icon={<CheckCircle size={16} aria-hidden="true" />} title="Application Management">
            <DetailField
              label="Created"
              value={`${when.date}${when.time ? ` · ${when.time}` : ""}`}
              icon={<Calendar size={14} aria-hidden="true" />}
            />
            <label className={styles.detailStatus}>
              <span>Status</span>
              <select
                className={styles.status}
                data-status={item.status}
                aria-label={`Status for ${item.name}`}
                value={item.status}
                onChange={(event) => onStatus(event.target.value as Status)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </label>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className={styles.detailSection}>
      <h3>
        {icon}
        {title}
      </h3>
      <div className={styles.detailGrid}>{children}</div>
    </section>
  );
}

function DetailField({
  label,
  value,
  href,
  copyValue,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={styles.detailField}>
      <span className={styles.detailFieldLabel}>{label}</span>
      <span className={styles.detailFieldValue}>
        {icon}
        {href ? (
          <a href={href}>{value}</a>
        ) : (
          <span>{value}</span>
        )}
        {copyValue ? <CopyButton value={copyValue} label={`Copy ${label}`} /> : null}
      </span>
    </div>
  );
}

function countExtraDetails(item: Application) {
  return Object.entries(item.details).filter(([key, value]) => {
    if (!value) return false;
    if (["name", "phone", "email", "zip", "service"].includes(key)) return false;
    if (value === item.service) return false;
    return true;
  }).length;
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
  return { ...item, status, form, details, consents: parseConsents(item.consents) };
}

function parseConsents(value: unknown): ApplicationConsents | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const privacy =
    item.privacyPolicy === "accepted" || item.privacyPolicy === "na" ? item.privacyPolicy : null;
  const sms =
    item.smsMarketing === "yes" || item.smsMarketing === "no" || item.smsMarketing === "na"
      ? item.smsMarketing
      : null;
  const email =
    item.emailMarketing === "yes" || item.emailMarketing === "no" || item.emailMarketing === "na"
      ? item.emailMarketing
      : null;
  if (!privacy || !sms || !email || typeof item.submittedAt !== "string") return null;
  return {
    privacyPolicy: privacy,
    smsMarketing: sms,
    emailMarketing: email,
    submittedAt: item.submittedAt,
    smsText: typeof item.smsText === "string" ? item.smsText : null,
    emailText: typeof item.emailText === "string" ? item.emailText : null,
    smsGrantedAt: typeof item.smsGrantedAt === "string" ? item.smsGrantedAt : null,
    emailGrantedAt: typeof item.emailGrantedAt === "string" ? item.emailGrantedAt : null,
  };
}

function ConsentBlock({
  consents,
  submittedAt,
}: {
  consents: ApplicationConsents | null;
  submittedAt: string;
}) {
  if (!consents) {
    return (
      <ul className={styles.consentList}>
        <li>
          <span>Privacy Policy</span>
          <strong>Unknown</strong>
        </li>
        <li>
          <span>SMS Marketing</span>
          <strong>Unknown</strong>
        </li>
        <li>
          <span>Email Marketing</span>
          <strong>Unknown</strong>
        </li>
      </ul>
    );
  }

  const when = formatWhen(consents.submittedAt || submittedAt);
  const smsLabel = marketingLabel(consents.smsMarketing);
  const emailLabel = marketingLabel(consents.emailMarketing);

  return (
    <div className={styles.consentBlock}>
      <ul className={styles.consentList}>
        <li>
          <span>Privacy Policy</span>
          <strong data-state={consents.privacyPolicy === "accepted" ? "yes" : "na"}>
            {consents.privacyPolicy === "accepted" ? "Accepted" : "Not Applicable"}
          </strong>
        </li>
        <li>
          <span>SMS Marketing</span>
          <strong data-state={consents.smsMarketing}>{smsLabel}</strong>
        </li>
        <li>
          <span>Email Marketing</span>
          <strong data-state={consents.emailMarketing}>{emailLabel}</strong>
        </li>
      </ul>
      <p className={styles.consentMeta}>
        Submitted {when.date}
        {when.time ? ` · ${when.time}` : ""}
      </p>
      {consents.smsMarketing === "yes" && consents.smsGrantedAt ? (
        <p className={styles.consentMeta}>SMS accepted {formatWhen(consents.smsGrantedAt).copy}</p>
      ) : null}
      {consents.emailMarketing === "yes" && consents.emailGrantedAt ? (
        <p className={styles.consentMeta}>Email accepted {formatWhen(consents.emailGrantedAt).copy}</p>
      ) : null}
      {consents.smsText ? (
        <details className={styles.consentText}>
          <summary>SMS consent text</summary>
          <p>{consents.smsText}</p>
        </details>
      ) : null}
      {consents.emailText ? (
        <details className={styles.consentText}>
          <summary>Email consent text</summary>
          <p>{consents.emailText}</p>
        </details>
      ) : null}
    </div>
  );
}

function marketingLabel(value: "yes" | "no" | "na") {
  if (value === "yes") return "Accepted";
  if (value === "no") return "Declined";
  return "Not Applicable";
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
