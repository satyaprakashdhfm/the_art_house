"use client";

import { Copy } from "lucide-react";
import { ui } from "@/context/ui";

export default function CopyCode({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          ui.toast(`Copied ${code}`);
        } catch {
          ui.toast(`Code: ${code}`);
        }
      }}
      className="flex w-full items-center justify-between border border-dashed border-gold px-4 py-2.5 text-sm hover:bg-gold/10"
    >
      <span className="font-semibold tracking-widest">{code}</span>
      <span className="flex items-center gap-1 text-xs text-muted">
        <Copy className="h-3.5 w-3.5" /> Copy
      </span>
    </button>
  );
}
