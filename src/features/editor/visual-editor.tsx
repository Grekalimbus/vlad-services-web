"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getPath, readCms } from "@/lib/cms/read";
import {
  adoptSaved,
  discardDraft,
  isDirty,
  peekDraft,
  publishDocument,
  setAt,
  setEditing,
} from "@/lib/cms/edit-store";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { heroSlides } from "@/features/home/hero-slides";
import { projectReels, type ReelPhoto } from "@/features/home/project-photos";
import { assetPath } from "@/lib/site";
import { ensureServiceTemplates } from "@/lib/service-pages";
import { removeHomepageService } from "./service-actions";
import "./visual-editor.css";

type Chip = { element: HTMLElement; top: number; left: number };
type Panel =
  | { kind: "text"; path: string; top: number; left: number }
  | { kind: "image"; path: string; top: number; left: number }
  | { kind: "card"; card: string; top: number; left: number }
  | { kind: "gallery"; gallery: string };

export function VisualEditor() {
  const pathname = usePathname();
  const editing = useEditing();
  const cms = useCms();
  const [chip, setChip] = useState<Chip | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const dirty = isDirty();
  void cms;

  const admin = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (admin) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      fetch("/api/admin/session")
        .then((response) => response.json())
        .then(async (body: { authenticated?: boolean }) => {
          if (cancelled) return;
          if (body.authenticated) {
            try {
              const response = await fetch("/api/content", { cache: "no-store" });
              const document = response.ok ? await response.json() : null;
              if (!cancelled && document && document.version === 1 && Array.isArray(document.serviceCategories)) {
                publishDocument(ensureServiceTemplates(document));
              }
            } catch {
              // Keep the document already on the page if the live copy cannot be loaded.
            }
          }
          if (!cancelled) setEditing(Boolean(body.authenticated));
        })
        .catch(() => {
          if (!cancelled) setEditing(false);
        });
    }, 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [admin]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-editing", editing);
    return () => document.documentElement.removeAttribute("data-editing");
  }, [editing]);

  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  useEffect(() => {
    if (!editing) return;
    let hot: HTMLElement | null = null;
    let armed: HTMLElement | null = null;

    function paint(target: EventTarget | null) {
      const next = target instanceof Element ? highlightTarget(target) : null;
      if (hot === next) return;
      hot?.removeAttribute("data-edit-hot");
      next?.setAttribute("data-edit-hot", "");
      hot = next;
    }

    function onOver(event: PointerEvent) {
      paint(event.target);
      const control = event.target instanceof Element ? controlText(event.target) : null;
      if (!control || window.matchMedia("(hover: none)").matches) return;
      const rect = control.getBoundingClientRect();
      setChip({ element: control, top: rect.top - 34, left: rect.left });
    }

    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-editor-ui]")) return;
      const control = controlText(event.target);
      if (control) {
        const coarse = window.matchMedia("(hover: none)").matches;
        if (coarse && armed !== control) {
          event.preventDefault();
          event.stopPropagation();
          armed = control;
          const rect = control.getBoundingClientRect();
          setChip({ element: control, top: Math.max(8, rect.top - 36), left: rect.left });
        }
        return;
      }
      const editable = directTarget(event.target);
      if (!editable) return;
      event.preventDefault();
      event.stopPropagation();
      setChip(null);
      setPanel(panelFor(editable));
    }

    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick, true);
    return () => {
      hot?.removeAttribute("data-edit-hot");
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, [editing]);

  if (!editing || admin) return null;

  async function save() {
    const document = peekDraft();
    if (!document) return;
    setSaving(true);
    setFailed(false);
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(document),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save.");
      adoptSaved(payload);
      setMessage("Saved");
      setPanel(null);
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (dirty && !window.confirm("You have unsaved changes. Log out without saving?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    setEditing(false);
    setPanel(null);
    setChip(null);
  }

  const status = saving ? "Saving…" : message || (dirty ? "Unsaved changes" : "Editing");

  return (
    <div data-editor-ui>
      <div className="editorBar">
        <p className="editorStatus" role="status" data-bad={failed ? "true" : undefined}>
          {status}
        </p>
        {dirty ? (
          <button
            type="button"
            className="editorQuiet"
            onClick={() => {
              discardDraft();
              setMessage("");
              setFailed(false);
              setPanel(null);
            }}
          >
            Discard
          </button>
        ) : null}
        <button type="button" className="editorSave" disabled={!dirty || saving} onClick={() => void save()}>
          Save changes
        </button>
        <button type="button" className="editorQuiet" onClick={() => void logout()}>
          Log out
        </button>
      </div>
      {chip ? (
        <button
          type="button"
          className="editorChip"
          style={{ top: Math.max(8, chip.top), left: Math.min(chip.left, window.innerWidth - 72) }}
          onClick={() => {
            setPanel(panelFor(chip.element));
            setChip(null);
          }}
        >
          Edit
        </button>
      ) : null}
      {panel?.kind === "text" ? <TextPopover panel={panel} onClose={() => setPanel(null)} /> : null}
      {panel?.kind === "image" ? <ImagePopover panel={panel} onClose={() => setPanel(null)} /> : null}
      {panel?.kind === "card" ? <CardPopover card={panel.card} top={panel.top} left={panel.left} onClose={() => setPanel(null)} /> : null}
      {panel?.kind === "gallery" ? <GalleryModal gallery={panel.gallery} onClose={() => setPanel(null)} /> : null}
    </div>
  );
}

function TextPopover({ panel, onClose }: { panel: Extract<Panel, { kind: "text" }>; onClose: () => void }) {
  const value = textAt(panel.path);
  const multiline = value.length > 80 || value.includes("\n");
  return (
    <form className="editorPopover" style={anchor(panel.top, panel.left)} data-editor-ui onSubmit={(event) => event.preventDefault()}>
      <label className="editorLabel">
        Text
        {multiline ? (
          <textarea autoFocus value={value} onChange={(event) => setAt(panel.path, event.target.value)} />
        ) : (
          <input autoFocus value={value} onChange={(event) => setAt(panel.path, event.target.value)} />
        )}
      </label>
      <button type="button" className="editorPrimary" onClick={onClose}>
        Done
      </button>
    </form>
  );
}

function ImagePopover({ panel, onClose }: { panel: Extract<Panel, { kind: "image" }>; onClose: () => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const src = textAt(panel.path) || (panel.path === "copy.home.hero.builder" ? "/hero/builder.webp" : "");
  const portrait = panel.path === "copy.home.hero.builder";
  return (
    <div className="editorPopover" style={anchor(panel.top, panel.left)} data-editor-ui>
      {src ? (
        <img
          src={assetPath(src)}
          alt=""
          style={{
            width: "100%",
            height: portrait ? 220 : undefined,
            aspectRatio: portrait ? undefined : "16 / 9",
            objectFit: portrait ? "contain" : "cover",
            background: portrait ? "#0c121c" : undefined,
            borderRadius: 8,
          }}
        />
      ) : null}
      <div className="editorRow" style={{ marginTop: "0.7rem" }}>
        <label className="editorPrimary">
          {pending ? "Uploading…" : "Replace image"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setPending(true);
              setError("");
              void uploadImage(file)
                .then((next) => {
                  setAt(panel.path, next);
                  setPending(false);
                })
                .catch((reason: unknown) => {
                  setPending(false);
                  setError(reason instanceof Error ? reason.message : "Could not upload that image.");
                });
            }}
          />
        </label>
        <button type="button" className="editorQuiet" style={{ color: "#171717" }} onClick={onClose}>
          Done
        </button>
      </div>
      {error ? <p className="editorNote">{error}</p> : null}
    </div>
  );
}

function CardPopover({
  card,
  top,
  left,
  onClose,
}: {
  card: string;
  top: number;
  left: number;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const splitAt = card.indexOf(":");
  const kind = splitAt < 0 ? card : card.slice(0, splitAt);
  const id = splitAt < 0 ? "" : card.slice(splitAt + 1);
  const fields = cardFields(kind, id);

  function replace(path: string, file: File | undefined) {
    if (!file) return;
    setPending(true);
    setError("");
    void uploadImage(file)
      .then((src) => {
        setAt(path, src);
        if (kind === "service") {
          const cover = readCms().copy.home.serviceCovers.findIndex((item) => item.id === id);
          const index = readCms().serviceCategories.findIndex((item) => item.id === id);
          if (cover >= 0) setAt(`copy.home.serviceCovers.${cover}.src`, src);
          if (index >= 0) setAt(`serviceCategories.${index}.coverImage`, src);
        }
        setPending(false);
      })
      .catch((reason: unknown) => {
        setPending(false);
        setError(reason instanceof Error ? reason.message : "Could not upload that image.");
      });
  }

  if (!fields) return null;

  return (
    <form
      className="editorPopover"
      style={anchor(top, left)}
      data-editor-ui
      onSubmit={(event: FormEvent) => event.preventDefault()}
    >
      {fields.image ? (
        <>
          <img src={assetPath(textAt(fields.image))} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
          <label className="editorPrimary" style={{ display: "inline-block", margin: "0.7rem 0" }}>
            {pending ? "Uploading…" : "Replace image"}
            <input type="file" accept="image/*" hidden disabled={pending} onChange={(event) => replace(fields.image!, event.target.files?.[0])} />
          </label>
        </>
      ) : null}
      {fields.texts.map((field) => (
        <label key={field.path} className="editorLabel">
          {field.label}
          {field.long ? (
            <textarea value={textAt(field.path)} onChange={(event) => setAt(field.path, event.target.value)} />
          ) : (
            <input
              value={textAt(field.path)}
              inputMode={field.numeric ? "numeric" : undefined}
              onChange={(event) =>
                setAt(field.path, field.numeric ? Number(event.target.value.replace(/[^\d]/g, "")) || 0 : event.target.value)
              }
            />
          )}
        </label>
      ))}
      {fields.remove ? (
        confirming ? (
          <button
            type="button"
            className="editorDanger"
            onClick={() => {
              removeHomepageService(id);
              onClose();
            }}
          >
            Confirm remove
          </button>
        ) : (
          <button type="button" className="editorDanger" onClick={() => setConfirming(true)}>
            Remove service
          </button>
        )
      ) : null}
      {error ? <p className="editorNote">{error}</p> : null}
      <button type="button" className="editorPrimary" onClick={onClose}>
        Done
      </button>
    </form>
  );
}

function GalleryModal({ gallery, onClose }: { gallery: string; onClose: () => void }) {
  const titleId = useId();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const frames = galleryFrames(gallery);
  const photosOnly = gallery.startsWith("photos:") || gallery.startsWith("reels:");
  const title = gallery === "reels:top" ? "Top carousel" : gallery === "reels:bottom" ? "Bottom carousel" : "Photos";
  const dragStart = useRef<{ index: number; x: number; y: number } | null>(null);
  const dragMoved = useRef(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function thumbAt(x: number, y: number) {
    const thumb = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-thumb]");
    const index = thumb ? Number(thumb.dataset.thumb) : null;
    return index == null || Number.isNaN(index) ? null : index;
  }

  function dragImage(index: number) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLImageElement>) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = { index, x: event.clientX, y: event.clientY };
        dragMoved.current = false;
      },
      onPointerMove: (event: ReactPointerEvent<HTMLImageElement>) => {
        const origin = dragStart.current;
        if (!origin) return;
        if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 4) dragMoved.current = true;
        if (!dragMoved.current) return;
        setDragIndex(origin.index);
        setOverIndex(thumbAt(event.clientX, event.clientY));
      },
      onPointerUp: (event: ReactPointerEvent<HTMLImageElement>) => {
        const origin = dragStart.current;
        const to = thumbAt(event.clientX, event.clientY);
        dragStart.current = null;
        if (origin && dragMoved.current && to != null) reorderFrames(gallery, origin.index, to);
        dragMoved.current = false;
        setDragIndex(null);
        setOverIndex(null);
      },
      onPointerCancel: () => {
        dragStart.current = null;
        dragMoved.current = false;
        setDragIndex(null);
        setOverIndex(null);
      },
    };
  }

  function change(file: File | undefined, apply: (src: string) => void) {
    if (!file) return;
    setPending(true);
    setError("");
    void uploadImage(file)
      .then((src) => {
        apply(src);
        setPending(false);
      })
      .catch((reason: unknown) => {
        setPending(false);
        setError(reason instanceof Error ? reason.message : "Could not upload that image.");
      });
  }

  return (
    <div className="editorBackdrop" data-editor-ui onClick={onClose}>
      <div
        className="editorModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="editorModalHead">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="editorClose" onClick={onClose}>
            Close
          </button>
        </div>
        <ul className="editorThumbs">
          {frames.map((frame, index) => (
            <li
              key={frame.key}
              className="editorThumb"
              data-thumb={index}
              data-dragging={dragIndex === index ? "" : undefined}
              data-over={overIndex === index && dragIndex !== index ? "" : undefined}
            >
              <img src={assetPath(frame.src)} alt="" {...dragImage(index)} />
              {frame.secondary ? <img src={assetPath(frame.secondary)} alt="" {...dragImage(index)} /> : null}
              {photosOnly || !frame.captionPath ? null : (
                <label className="editorLabel">
                  Caption
                  <input value={textAt(frame.captionPath)} onChange={(event) => setAt(frame.captionPath!, event.target.value)} />
                </label>
              )}
              <div className="editorThumbActions">
                <label>
                  {photosOnly ? "Change" : frame.secondary ? "Replace before" : "Replace"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      change(file, (src) => replaceFrame(gallery, index, src, false));
                    }}
                  />
                </label>
                {frame.secondary ? (
                  <label>
                    Replace after
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        change(file, (src) => replaceFrame(gallery, index, src, true));
                      }}
                    />
                  </label>
                ) : null}
                <button type="button" onClick={() => deleteFrame(gallery, index)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <label className="editorAdd">
          {pending ? "Uploading…" : photosOnly ? "Add" : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={pending}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (files.length === 0) return;
              setPending(true);
              setError("");
              void Promise.all(files.map((file) => uploadImage(file)))
                .then((sources) => {
                  sources.forEach((src) => addFrame(gallery, src));
                  setPending(false);
                })
                .catch((reason: unknown) => {
                  setPending(false);
                  setError(reason instanceof Error ? reason.message : "Could not upload that image.");
                });
            }}
          />
        </label>
        {error ? <p className="editorNote">{error}</p> : null}
      </div>
    </div>
  );
}

function anchor(top: number, left: number) {
  const width = 340;
  return {
    top: Math.max(8, Math.min(top, window.innerHeight - 420)),
    left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
  };
}

function textAt(path: string) {
  const value = getPath(readCms(), path);
  return value == null ? "" : String(value);
}

async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", body });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Could not upload that image.");
  return String(payload.src || "");
}

function controlText(target: Element) {
  const text = target.closest<HTMLElement>("[data-cms]");
  if (!text) return null;
  const card = text.closest("[data-cms-card]");
  if (card && card !== text) return null;
  const host = text.closest("a, button, label");
  if (!host) return null;
  return text;
}

function directTarget(target: Element) {
  if (target.closest("input, textarea, select")) return null;
  const card = target.closest<HTMLElement>("[data-cms-card]");
  if (card) {
    const button = target.closest("button");
    if (button && card.contains(button)) return null;
    return card;
  }
  const gallery = target.closest<HTMLElement>("[data-cms-gallery]");
  if (gallery) {
    const control = target.closest("button, a");
    if (control && control !== gallery) return null;
    return gallery;
  }
  if (controlText(target)) return null;
  const text = target.closest<HTMLElement>("[data-cms]");
  if (text && !text.closest("a, button, label")) return text;
  const image = target.closest<HTMLElement>("[data-cms-src], [data-cms-photo]");
  if (image && !target.closest("a, button, label")) return image;
  return null;
}

function highlightTarget(target: Element) {
  return controlText(target) ?? directTarget(target);
}

function panelFor(element: HTMLElement): Panel {
  const rect = element.getBoundingClientRect();
  const top = rect.bottom + 8;
  const left = rect.left;
  const card = element.getAttribute("data-cms-card");
  if (card) return { kind: "card", card, top, left };
  const gallery = element.getAttribute("data-cms-gallery");
  if (gallery) return { kind: "gallery", gallery };
  const path = element.getAttribute("data-cms") || element.getAttribute("data-cms-src") || element.getAttribute("data-cms-photo");
  if (element.hasAttribute("data-cms-src") || element.hasAttribute("data-cms-photo")) {
    return { kind: "image", path: path || "", top, left };
  }
  return { kind: "text", path: path || "", top, left };
}

type CardField = { path: string; label: string; long?: boolean; numeric?: boolean };

function cardFields(kind: string, id: string): { image: string; remove: boolean; texts: CardField[] } | null {
  const document = readCms();
  if (kind === "offer") {
    const separator = id.lastIndexOf(":");
    const categoryId = separator > 0 ? id.slice(0, separator) : "";
    const index = Number(separator > 0 ? id.slice(separator + 1) : "");
    if (!categoryId || !Number.isInteger(index) || index < 0) return null;
    return {
      image: "",
      remove: false,
      texts: [
        { path: `copy.offers.${categoryId}.${index}.title`, label: "Title" },
        { path: `copy.offers.${categoryId}.${index}.description`, label: "Description", long: true },
      ],
    };
  }
  if (kind === "service") {
    const index = document.serviceCategories.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const cover = document.copy.home.serviceCovers.findIndex((item) => item.id === id);
    return {
      image: cover >= 0 ? `copy.home.serviceCovers.${cover}.src` : `serviceCategories.${index}.coverImage`,
      remove: true,
      texts: [
        { path: `serviceCategories.${index}.name`, label: "Title" },
        { path: `serviceCategories.${index}.summary`, label: "Description", long: true },
      ],
    };
  }
  if (kind === "additional") {
    return {
      image: `copy.additionals.cards.${id}.image`,
      remove: false,
      texts: [
        { path: `copy.additionals.cards.${id}.title`, label: "Title" },
        { path: `copy.additionals.cards.${id}.text`, label: "Description", long: true },
      ],
    };
  }
  if (kind === "works") {
    const card = document.copy.home.works.cards[Number(id)];
    const texts: CardField[] =
      card?.lines?.length > 0
        ? card.lines.map((_, line) => ({
            path: `copy.home.works.cards.${id}.lines.${line}`,
            label: card.lines.length > 1 ? `Title line ${line + 1}` : "Title",
          }))
        : [{ path: `copy.home.works.cards.${id}.title`, label: "Title" }];
    return { image: `copy.home.works.cards.${id}.src`, remove: false, texts };
  }
  if (kind === "trust") {
    const index = document.trustItems.findIndex((item) => item.id === id);
    if (index < 0) return null;
    return {
      image: "",
      remove: false,
      texts: [
        { path: `trustItems.${index}.value`, label: "Number", numeric: true },
        { path: `trustItems.${index}.suffix`, label: "Text after the number" },
        { path: `trustItems.${index}.label`, label: "Label" },
      ],
    };
  }
  return null;
}

type Frame = { key: string; src: string; secondary?: string; captionPath?: string };

function reelRow(gallery: string) {
  if (gallery === "reels:top" || gallery === "reels:bottom") return gallery.slice("reels:".length) as "top" | "bottom";
  return null;
}

function reelPhotos(gallery: string) {
  const row = reelRow(gallery);
  if (!row) return null;
  return projectReels(readCms())[row].map((photo) => ({ ...photo }));
}

function commitReel(gallery: string, photos: ReelPhoto[]) {
  const row = reelRow(gallery);
  if (!row) return;
  const current = projectReels(readCms());
  setAt("copy.home.works.reels", { ...current, [row]: photos });
}

function galleryFrames(gallery: string): Frame[] {
  const reel = reelPhotos(gallery);
  if (reel) {
    return reel.map((photo, index) => ({
      key: `${index}-${photo.image}`,
      src: photo.image,
    }));
  }
  const document = readCms();
  if (gallery.startsWith("slides:")) {
    return slideArray(gallery).slides.map((slide, index) => ({
      key: `${index}-${slide?.image ?? index}`,
      src: String(slide?.image ?? ""),
    }));
  }
  const categoryId = itemCategory(gallery);
  const photosOnly = gallery.startsWith("photos:");
  return document.galleryItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.categoryId === categoryId)
    .map(({ item, index }) => ({
      key: item.id,
      src: photosOnly ? item.src || "" : item.beforeSrc || item.src || "",
      secondary: photosOnly || !item.beforeSrc ? undefined : item.afterSrc || "",
      captionPath: photosOnly ? undefined : `galleryItems.${index}.title`,
    }));
}

function itemCategory(gallery: string) {
  return gallery.replace(/^(?:items|photos):/, "");
}

type SlideRecord = { image?: string; alt?: string; position?: string };

function slideArray(gallery: string): { path: string; slides: SlideRecord[] } {
  const path = gallery.slice("slides:".length);
  const current = getPath(readCms(), path);
  if (Array.isArray(current)) {
    return {
      path,
      slides: current.flatMap((slide) =>
        slide && typeof slide === "object" ? [{ ...(slide as SlideRecord) }] : [],
      ),
    };
  }
  if (path === "copy.home.hero.slides") {
    return { path, slides: heroSlides(readCms().copy.home.hero).map((slide) => ({ ...slide })) };
  }
  return { path, slides: [] };
}

function commitSlides(path: string, slides: SlideRecord[]) {
  setAt(path, slides);
  if (path !== "copy.home.hero.slides") return;
  const first = slides[0];
  const second = slides[1];
  setAt("copy.home.hero.image", first?.image ?? "");
  setAt("copy.home.hero.imageAlt", first?.alt ?? "");
  setAt("copy.home.hero.imageNext", second?.image ?? "");
  setAt("copy.home.hero.imageNextAlt", second?.alt ?? "");
}

function categoryEntries(gallery: string) {
  const categoryId = itemCategory(gallery);
  const items = [...readCms().galleryItems];
  const indexes = items.flatMap((item, index) => (item.categoryId === categoryId ? [index] : []));
  return { items, indexes, categoryId };
}

function reorderFrames(gallery: string, from: number, to: number) {
  if (from === to) return;
  const reel = reelPhotos(gallery);
  if (reel) {
    if (from < 0 || to < 0 || from >= reel.length || to >= reel.length) return;
    const [item] = reel.splice(from, 1);
    reel.splice(to, 0, item);
    commitReel(gallery, reel);
    return;
  }
  if (gallery.startsWith("slides:")) {
    const { path, slides } = slideArray(gallery);
    if (from < 0 || to < 0 || from >= slides.length || to >= slides.length) return;
    const next = slides.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commitSlides(path, next);
    return;
  }
  const { items, indexes } = categoryEntries(gallery);
  if (from < 0 || to < 0 || from >= indexes.length || to >= indexes.length) return;
  const subset = indexes.map((index) => items[index]);
  const [item] = subset.splice(from, 1);
  subset.splice(to, 0, item);
  const next = items.slice();
  indexes.forEach((index, position) => {
    next[index] = subset[position];
  });
  setAt("galleryItems", next);
}

function deleteFrame(gallery: string, index: number) {
  const reel = reelPhotos(gallery);
  if (reel) {
    reel.splice(index, 1);
    commitReel(gallery, reel);
    return;
  }
  if (gallery.startsWith("slides:")) {
    const { path, slides } = slideArray(gallery);
    slides.splice(index, 1);
    commitSlides(path, slides);
    return;
  }
  const { items, indexes } = categoryEntries(gallery);
  items.splice(indexes[index], 1);
  setAt("galleryItems", items);
}

function replaceFrame(gallery: string, index: number, src: string, secondary: boolean) {
  const reel = reelPhotos(gallery);
  if (reel) {
    if (!reel[index]) return;
    reel[index] = { ...reel[index], image: src };
    commitReel(gallery, reel);
    return;
  }
  if (gallery.startsWith("slides:")) {
    const { path, slides } = slideArray(gallery);
    slides[index] = { ...slides[index], image: src };
    commitSlides(path, slides);
    return;
  }
  const { items, indexes } = categoryEntries(gallery);
  const item = { ...items[indexes[index]] };
  if (item.beforeSrc || secondary) {
    if (secondary) item.afterSrc = src;
    else item.beforeSrc = src;
    if (!secondary && item.src) item.src = src;
  } else {
    item.src = src;
  }
  items[indexes[index]] = item;
  setAt("galleryItems", items);
}

function addFrame(gallery: string, src: string) {
  const reel = reelPhotos(gallery);
  if (reel) {
    reel.push({ image: src, alt: "Project photo" });
    commitReel(gallery, reel);
    return;
  }
  if (gallery.startsWith("slides:")) {
    const { path, slides } = slideArray(gallery);
    slides.push({ image: src, alt: "Photo", position: "center" });
    commitSlides(path, slides);
    return;
  }
  const { items, categoryId } = categoryEntries(gallery);
  const subs = readCms().gallerySubcategories.filter((item) => item.categoryId === categoryId);
  const beforeAfter = categoryId === "before-after";
  items.push({
    id: `photo-${crypto.randomUUID().slice(0, 8)}`,
    categoryId,
    subcategoryId: subs[0]?.id ?? "",
    title: "Photo",
    summary: "",
    alt: "Project photo",
    kind: beforeAfter ? "before-after" : "project",
    src,
    ...(beforeAfter ? { beforeSrc: src, afterSrc: src } : {}),
  } as (typeof items)[number]);
  setAt("galleryItems", items);
}
