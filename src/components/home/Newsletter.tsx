"use client";

import { useState } from "react";
import { ui } from "@/context/ui";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-ink py-16 text-paper">
      <div className="container-page max-w-2xl text-center">
        <p className="text-xs tracking-[0.25em] text-gold uppercase">Join the Verona Arts circle</p>
        <h2 className="mt-3 font-serif text-3xl">Get 10% off your first order</h2>
        <p className="mt-3 text-sm text-paper/70">New collections, festive offers and studio stories — straight to your inbox.</p>
        <form
          className="mt-8 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            ui.toast("Thanks for subscribing! Use WELCOME10 at checkout.");
            setEmail("");
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="flex-1 border border-paper/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-paper/50 focus:border-paper"
          />
          <button type="submit" className="btn-gold">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
