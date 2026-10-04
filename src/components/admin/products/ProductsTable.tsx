"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Search, Trash2 } from "lucide-react";
import { deleteRow, setFlag } from "@/app/admin/actions";
import { Toggle } from "@/components/admin/fields";
import { useConfirm } from "@/components/admin/useConfirm";
import { ui } from "@/context/ui";
import { toProduct, type GroupRow, type ProductRow, type SubRow } from "@/lib/db";
import { MEDIUM_LABELS, SUBJECT_GROUPS } from "@/lib/labels";
import { startingPrice } from "@/lib/price";
import { formatINR } from "@/lib/format";

type Status = "all" | "live" | "hidden";
type Flag = "is_published" | "is_bestseller" | "is_new";

export default function ProductsTable({ rows, groups, subs }: { rows: ProductRow[]; groups: GroupRow[]; subs: SubRow[] }) {
  const [items, setItems] = useState(rows);
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setItems(rows);
  }

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [, start] = useTransition();
  const { confirm, dialog } = useConfirm();

  const groupName = (slug: string) => groups.find((g) => g.slug === slug)?.name ?? slug;
  const subName = (slug: string) => subs.find((s) => s.slug === slug)?.name ?? slug;

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (p) =>
      (!q || `${p.title} ${subName(p.sub_category)} ${p.medium}`.toLowerCase().includes(q)) &&
      (!group || p.group_slug === group) &&
      (status === "all" || (status === "live") === p.is_published),
  );

  function toggle(p: ProductRow, field: Flag) {
    const value = !p[field];
    setItems((list) => list.map((x) => (x.id === p.id ? { ...x, [field]: value } : x)));
    start(async () => {
      const res = await setFlag("products", p.id, field, value);
      if (!res.ok) {
        ui.toast(res.error);
        setItems(rows);
      } else if (field === "is_published") {
        ui.toast(value ? `“${p.title}” is now live` : `“${p.title}” is hidden`);
      }
    });
  }

  async function remove(p: ProductRow) {
    const ok = await confirm({
      title: "Delete this product?",
      message: `“${p.title}” and its uploaded images will be permanently deleted. To take it off the website temporarily, hide it instead.`,
    });
    if (!ok) return;
    setItems((list) => list.filter((x) => x.id !== p.id));
    start(async () => {
      const res = await deleteRow("products", p.id);
      ui.toast(res.ok ? `Deleted “${p.title}”` : res.error);
      if (!res.ok) setItems(rows);
    });
  }

  const live = items.filter((p) => p.is_published).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, sub-category or medium…" className="input py-2.5 pl-9" />
        </div>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="input w-auto py-2.5" aria-label="Filter by category">
          <option value="">All categories</option>
          {SUBJECT_GROUPS.map((g) => (
            <option key={g} value={g}>
              {groupName(g)}
            </option>
          ))}
        </select>
        <div className="flex border border-line bg-paper text-sm">
          {(
            [
              ["all", `All (${items.length})`],
              ["live", `Live (${live})`],
              ["hidden", `Hidden (${items.length - live})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={`px-3 py-2 transition-colors ${status === key ? "bg-ink text-white" : "hover:bg-card"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line bg-card/60 text-left text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-3 py-3 text-center font-medium">Live</th>
              <th className="px-3 py-3 text-center font-medium">Bestseller</th>
              <th className="px-3 py-3 text-center font-medium">New</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((p) => (
              <tr key={p.id} className={p.is_published ? "" : "bg-card/40"}>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="group flex items-center gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-card">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate font-medium group-hover:text-gold ${p.is_published ? "" : "text-muted"}`}>{p.title}</p>
                      <p className="text-xs text-muted">
                        {MEDIUM_LABELS[p.medium as keyof typeof MEDIUM_LABELS]} · {p.type.replace(/-/g, " ")}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {groupName(p.group_slug)}
                  <span className="block text-xs">{subName(p.sub_category)}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatINR(startingPrice(toProduct(p)))}</td>
                <td className="px-3 py-3 text-center">
                  <Toggle checked={p.is_published} onChange={() => toggle(p, "is_published")} />
                </td>
                <td className="px-3 py-3 text-center">
                  <Toggle checked={p.is_bestseller} onChange={() => toggle(p, "is_bestseller")} />
                </td>
                <td className="px-3 py-3 text-center">
                  <Toggle checked={p.is_new} onChange={() => toggle(p, "is_new")} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {p.is_published && (
                      <Link href={`/product/${p.slug}`} target="_blank" aria-label="View on website" className="p-2 text-muted hover:text-ink">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link href={`/admin/products/${p.id}`} aria-label="Edit" className="p-2 text-muted hover:text-ink">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button type="button" onClick={() => remove(p)} aria-label="Delete" className="p-2 text-muted hover:text-sale">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="py-16 text-center text-sm text-muted">No products match these filters.</p>}
      </div>
      {dialog}
    </div>
  );
}
