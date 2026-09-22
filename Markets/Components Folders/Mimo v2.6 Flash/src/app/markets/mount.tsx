"use client";

import { useEffect } from "react";
// @ts-ignore — plain-JS design modules (not type-checked)
import { boot } from "./kit";
// @ts-ignore — plain-JS design modules (not type-checked)
import { apx } from "./apx";
// @ts-ignore — plain-JS design modules (not type-checked)
import { ledger } from "./ledger";
// @ts-ignore — plain-JS design modules (not type-checked)
import { strand } from "./strand";

export default function Mount({ initial }: { initial: string }) {
  useEffect(() => {
    boot({ apx, ledger, strand });
  }, []);

  // The server-rendered first view paints immediately; the router takes over on mount.
  return <div id="app" dangerouslySetInnerHTML={{ __html: initial }} />;
}
