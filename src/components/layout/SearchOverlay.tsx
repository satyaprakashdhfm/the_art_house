"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { ui, useUI } from "@/context/ui";
import { PRODUCTS } from "@/data/products";
import { CATEGORY_GROUPS, MEDIUM_LABELS, subName } from "@/data/categories";
import { subHref } from "@/components/layout/nav";
import { startingPrice } from "@/lib/price";
import { formatINR } from "@/lib/format";

const TRENDING = ["Radha Krishna", "Buddha", "Pencil portrait", "Horses", "Couple", "Landscape"];

export default function SearchOverlay() {
  const { searchOpen } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ui.closeSearch();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const q = query.trim().toLowerCase();

  const products = useMemo(() => {
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      [p.title, subName(p.subCategory), MEDIUM_LABELS[p.medium], p.style].join(" ").toLowerCase().includes(q),
    ).slice(0, 8);
  }, [q]);

  const categories = useMemo(() => {
    if (!q) return [];
    return CATEGORY_GROUPS.flatMap((g) =>
      g.subs.filter((s) => s.name.toLowerCase().includes(q)).map((s) => ({ ...s, group: g.slug })),
    ).slice(0, 6);
  }, [q]);

  if (!searchOpen) return null;

  const close = () => {
    ui.closeSearch();
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-paper" role="dialog" aria-modal="true" aria-label="Search">
      <div className="container-page py-6">
        <div className="flex items-center gap-3 border-b border-ink pb-3">
          <Search className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search paintings, categories, mediums…"
            className="flex-1 bg-transparent font-serif text-xl outline-none sm:text-2xl"
          />
          <button type="button" onClick={close} aria-label="Close search" className="p-1 hover:text-gold">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!q && (
          <div className="mt-8">
            <p className="eyebrow">Trending searches</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuery(t)}
                  className="border border-line px-4 py-2 text-sm hover:border-ink"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && (
          <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="eyebrow">Categories</p>
              <ul className="mt-4 space-y-2">
                {categories.length === 0 && <li className="text-sm text-muted">No matching categories</li>}
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={subHref(c.group, c.slug)} onClick={close} className="text-sm hover:text-gold">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Paintings</p>
              {products.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No paintings match “{query}”.</p>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {products.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} onClick={close} className="group block">
                        <div className="relative aspect-[4/5] overflow-hidden bg-line">
                          <Image src={p.images[0]} alt={p.title} fill sizes="200px" className="object-cover" />
                        </div>
                        <p className="mt-2 text-sm group-hover:text-gold">{p.title}</p>
                        <p className="text-xs text-muted">From {formatINR(startingPrice(p))}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={close}
                className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-gold"
              >
                See all results in Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
