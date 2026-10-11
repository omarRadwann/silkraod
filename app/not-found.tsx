import { base } from "@/lib/catalog";
export default function NotFound() {
  return (
    <main className="empty-order" style={{ minHeight: "100vh" }}>
      <a className="wordmark" href={`${base}/`}>
        silkraod®
      </a>
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1>Let’s find your way back.</h1>
      <p>
        This page could not be found. There are still plenty of possibilities in
        the collection.
      </p>
      <a className="button dark" href={`${base}/#collection`}>
        Explore the ingredients ↗
      </a>
    </main>
  );
}
