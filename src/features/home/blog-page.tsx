"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { addBlogPost } from "@/features/editor/blog-actions";
import { blogPage } from "@/lib/cms/blog-page";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import { PageFrame } from "@/shared/layout";
import styles from "./deals-page.module.css";

function indexFromHash(items: { id: string }[]) {
  const id = window.location.hash.replace(/^#/, "");
  if (!id) return 0;
  const next = items.findIndex((item) => item.id === id);
  return next >= 0 ? next : 0;
}

export function BlogPageView() {
  const cms = useCms();
  const editing = useEditing();
  const page = blogPage(cms);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const index = page.items.length === 0 ? 0 : Math.min(active, page.items.length - 1);
  const post = page.items[index];

  useLayoutEffect(() => {
    setActive(indexFromHash(page.items));
    setReady(true);
  }, [page.items]);

  useEffect(() => {
    const sync = () => setActive(indexFromHash(page.items));
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [page.items]);

  return (
    <PageFrame light flush eyebrow="Blog" title={page.title} hero={<></>}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h1 className={styles.pageTitle} data-cms="copy.blogPage.title">
            {page.title}
          </h1>
          <ul className={styles.nav} aria-label="Blog">
            {page.items.map((item, itemIndex) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.item}
                  aria-current={itemIndex === index ? "true" : undefined}
                  onClick={() => {
                    setActive(itemIndex);
                    const url = new URL(window.location.href);
                    url.hash = item.id;
                    window.history.replaceState(null, "", url);
                  }}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          {editing ? (
            <button
              type="button"
              className={styles.add}
              onClick={() => {
                addBlogPost();
                setActive(page.items.length);
              }}
            >
              New post
            </button>
          ) : null}
        </aside>
        {!ready ? (
          <div className={styles.stage} aria-hidden="true" />
        ) : post ? (
          <article className={styles.stage}>
            <figure className={styles.mediaHit} data-cms-card={`blog:${index}`} data-empty={post.media ? undefined : ""}>
              {post.media ? (
                post.kind === "video" ? (
                  <video
                    key={post.media || post.id}
                    className={styles.media}
                    src={assetPath(post.media)}
                    controls
                    playsInline
                    data-cms-src={`copy.blogPage.items.${index}.media`}
                  />
                ) : (
                  <Image
                    key={post.media || post.id}
                    src={assetPath(post.media)}
                    alt={post.alt || post.title}
                    data-cms-alt={`copy.blogPage.items.${index}.alt`}
                    width={700}
                    height={400}
                    priority
                    unoptimized={post.media.startsWith("/api/media/")}
                    className={styles.media}
                    data-cms-src={`copy.blogPage.items.${index}.media`}
                  />
                )
              ) : (
                <div className={styles.media} aria-hidden="true" />
              )}
            </figure>
            <h2 className={styles.title} data-cms={`copy.blogPage.items.${index}.title`}>
              {post.title}
            </h2>
            <p className={styles.text} data-cms={`copy.blogPage.items.${index}.text`}>
              {post.text}
            </p>
          </article>
        ) : (
          <p className={styles.empty}>No posts yet.</p>
        )}
      </div>
    </PageFrame>
  );
}
