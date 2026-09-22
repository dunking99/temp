import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Meridian component studies.
 * Vol. 02 (Field Manual) is the current deliverable; Vol. 01 remains at /meridian.html.
 * Both are single self-contained HTML files served from /public.
 */
export default function HomePage() {
  redirect("/meridian-vol-02.html");
}
