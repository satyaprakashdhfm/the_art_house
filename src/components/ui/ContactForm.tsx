"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-line bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" strokeWidth={1.25} />
        <p className="mt-4 font-serif text-2xl">Message sent</p>
        <p className="mt-2 text-sm text-muted">We&apos;ll get back to you within one working day. (Demo — nothing was sent.)</p>
        <button type="button" className="btn-outline mt-6" onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="ct-name" className="label">Name</label>
        <input id="ct-name" required className="input" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="ct-email" className="label">Email</label>
        <input id="ct-email" type="email" required className="input" autoComplete="email" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-subject" className="label">Subject</label>
        <select id="ct-subject" className="input">
          <option>General question</option>
          <option>Order support</option>
          <option>Custom art enquiry</option>
          <option>Bulk / corporate order</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ct-message" className="label">Message</label>
        <textarea id="ct-message" rows={6} required className="input" />
      </div>
      <div>
        <button type="submit" className="btn-primary">
          Send message
        </button>
      </div>
    </form>
  );
}
