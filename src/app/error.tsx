"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const unavailable = error.name === "CmsUnavailableError" || /cms content/i.test(error.message);
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", maxWidth: 640 }}>
      <h1>{unavailable ? "Content is unavailable" : "This page failed to render"}</h1>
      <p>
        {unavailable
          ? "The current site content could not be loaded. Older copy was not substituted."
          : "The page could not be rendered. Refresh to try again."}
      </p>
    </main>
  );
}
