"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

type Request = { title: string; message: string; confirmLabel: string };

/** Promise-based confirm dialog: `if (await confirm({...})) …` */
export function useConfirm() {
  const [request, setRequest] = useState<Request | null>(null);
  const resolver = useRef<(ok: boolean) => void>(undefined);

  const confirm = useCallback((r: Partial<Request> & { message: string }) => {
    setRequest({ title: "Are you sure?", confirmLabel: "Delete", ...r });
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (ok: boolean) => {
    resolver.current?.(ok);
    setRequest(null);
  };

  const dialog = request && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => close(false)}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sale/10 text-sale">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 id="confirm-title" className="font-serif text-lg">
              {request.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{request.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => close(false)} className="btn-outline px-4 py-2" autoFocus>
            Cancel
          </button>
          <button type="button" onClick={() => close(true)} className="btn bg-sale px-4 py-2 text-white hover:bg-sale/90">
            {request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return { confirm, dialog };
}
