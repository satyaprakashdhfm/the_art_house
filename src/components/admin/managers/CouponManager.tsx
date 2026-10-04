"use client";

import CollectionManager from "@/components/admin/CollectionManager";
import type { CouponRow } from "@/lib/db";

type Option = { value: string; label: string };

const DEFAULTS: CouponRow = {
  code: "",
  title: "",
  description: "",
  terms: "",
  percent: 10,
  max_discount: null,
  min_items: 0,
  group_slugs: [],
  sub_slugs: [],
  is_active: true,
  sort_order: 0,
};

export default function CouponManager({ rows, groups, subs }: { rows: CouponRow[]; groups: Option[]; subs: Option[] }) {
  const name = (opts: Option[], v: string) => opts.find((o) => o.value === v)?.label ?? v;

  return (
    <CollectionManager<CouponRow>
      table="coupons"
      rows={rows}
      keyField="code"
      itemName="coupon"
      defaults={DEFAULTS}
      flags={[{ field: "is_active", label: "Active" }]}
      searchable={(r) => `${r.code} ${r.title}`}
      validate={(r) => {
        if (!/^[A-Z0-9]+$/.test(r.code)) return "Code can only use letters and numbers (no spaces).";
        if (!(Number(r.percent) > 0 && Number(r.percent) <= 100)) return "Discount must be between 1 and 100%.";
        if (r.min_items === null) r.min_items = 0;
        return null;
      }}
      fields={[
        { name: "code", label: "Code", type: "text", required: true, uppercase: true, lockOnEdit: true, placeholder: "e.g. DIWALI20" },
        { name: "percent", label: "Discount (%)", type: "number", required: true, min: 1, max: 100 },
        { name: "title", label: "Title", type: "text", required: true, wide: true, placeholder: "e.g. 20% off this Diwali" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "terms", label: "Terms (short)", type: "text", wide: true, placeholder: "e.g. Valid till 31 Oct. Max discount ₹1,000." },
        { name: "max_discount", label: "Maximum discount (₹)", type: "number", min: 1, help: "Leave empty for no limit." },
        { name: "min_items", label: "Minimum items in cart", type: "number", min: 0, help: "0 = no minimum." },
        {
          name: "group_slugs",
          label: "Only for these categories",
          type: "chips",
          options: groups,
          help: "Leave both category lists empty to apply the coupon to everything.",
        },
        { name: "sub_slugs", label: "Or only these sub-categories", type: "chips", options: subs },
      ]}
      renderItem={(r) => {
        const scope = [...r.group_slugs.map((g) => name(groups, g)), ...r.sub_slugs.map((s) => name(subs, s))];
        return (
          <div className="flex items-center gap-4">
            <span className="w-32 shrink-0 border border-dashed border-gold bg-gold/5 px-3 py-1.5 text-center font-mono text-sm font-semibold tracking-wider text-gold-dark">
              {r.code}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.title}</p>
              <p className="truncate text-xs text-muted">
                {Number(r.percent)}% off
                {r.max_discount ? ` · max ₹${r.max_discount.toLocaleString("en-IN")}` : ""}
                {r.min_items ? ` · ${r.min_items}+ items` : ""}
                {scope.length ? ` · ${scope.join(", ")}` : " · all products"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
