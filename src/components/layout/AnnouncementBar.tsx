"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBar({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-ink py-2 text-center text-xs tracking-wide text-paper" aria-live="polite">
      {messages[i % messages.length]}
    </div>
  );
}
