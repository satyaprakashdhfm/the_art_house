"use client";

import { useUI } from "@/context/ui";

export default function Toast() {
  const { toast } = useUI();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4" aria-live="polite">
      {toast && (
        <div key={toast.id} className="bg-ink px-5 py-3 text-sm text-paper shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
