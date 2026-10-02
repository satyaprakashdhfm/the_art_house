"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping on orders above ₹1,999",
  "Use code WELCOME10 for 10% off your first order",
  "Extra 5% off on prepaid orders",
  "Custom portraits — free digital preview before we paint",
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-ink py-2 text-center text-xs tracking-wide text-paper" aria-live="polite">
      {MESSAGES[i]}
    </div>
  );
}
