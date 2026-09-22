import Mount from "./mount";
// @ts-ignore — plain-JS design module (not type-checked)
import { apx } from "./apx";

export const metadata = {
  title: "Meridian Markets — three design directions",
  description:
    "Three complete, interactive design directions for the Meridian Markets page and its sub-pages: APX terminal, the Meridian Ledger broadsheet, and Strand.",
};

export default function MarketsPage() {
  // Server-render Design A so the page paints real content before hydration.
  const initial: string = apx.shell(apx.views.overview, { pKey: "overview", design: apx });
  return <Mount initial={initial} />;
}
