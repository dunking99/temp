import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Meridian — Component Plates, Working Paper №02.
 * The deliverable is a single self-contained HTML file served from /public.
 * Vol. 01 remains at /meridian.html.
 */
export default function HomePage() {
  redirect("/meridian-vol2.html");
}
