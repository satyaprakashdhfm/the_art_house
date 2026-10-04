"use client";

import Image from "next/image";
import CollectionManager from "@/components/admin/CollectionManager";
import { SUBJECT_GROUPS } from "@/lib/labels";
import { slugify } from "@/lib/slug";
import type { GroupRow, SubRow } from "@/lib/db";

function Thumb({ src, round = false }: { src: string; round?: boolean }) {
  return (
    <div className={`relative h-12 w-12 shrink-0 overflow-hidden bg-card ${round ? "rounded-full" : ""}`}>
      {src && <Image src={src} alt="" fill sizes="48px" className="object-cover" />}
    </div>
  );
}

export default function CategoriesManager({ groups, subs }: { groups: GroupRow[]; subs: SubRow[] }) {
  return (
    <div className="space-y-14">
      <section>
        <h2 className="mb-3 font-serif text-xl">Collections</h2>
        <CollectionManager<GroupRow>
          table="category_groups"
          rows={groups}
          keyField="slug"
          itemName="collection"
          defaults={{ slug: "", name: "", tagline: "", image: "", sort_order: 0 }}
          canAdd={false}
          canDelete={false}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "tagline", label: "Tagline", type: "text", placeholder: "Shown above the collection name" },
            { name: "image", label: "Image", type: "image", folder: "categories", aspect: "aspect-[3/2]" },
          ]}
          renderItem={(g) => (
            <div className="flex items-center gap-4">
              <Thumb src={g.image} round />
              <div className="min-w-0">
                <p className="text-sm font-medium">{g.name}</p>
                <p className="truncate text-xs text-muted">{g.tagline}</p>
              </div>
            </div>
          )}
        />
      </section>

      {groups.map((g) => {
        const isSubject = (SUBJECT_GROUPS as readonly string[]).includes(g.slug);
        return (
          <section key={g.slug}>
            <h2 className="mb-3 font-serif text-xl">
              {g.name} <span className="text-base text-muted">· sub-categories</span>
            </h2>
            <CollectionManager<SubRow>
              table="subcategories"
              rows={subs.filter((s) => s.group_slug === g.slug)}
              keyField="slug"
              itemName="sub-category"
              defaults={{ slug: "", group_slug: g.slug, name: "", image: "", sort_order: 0 }}
              canAdd={isSubject}
              canDelete={isSubject}
              validate={(s) => {
                if (!s.slug) s.slug = slugify(s.name);
                return s.slug ? null : "Please enter a name.";
              }}
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "slug",
                  label: "Web address",
                  type: "text",
                  lockOnEdit: true,
                  placeholder: "made from the name if left empty",
                  help: "Used in the page link, e.g. /categories/spiritual/radha-krishna",
                },
                { name: "image", label: "Image", type: "image", folder: "categories", aspect: "aspect-square" },
              ]}
              renderItem={(s) => (
                <div className="flex items-center gap-4">
                  <Thumb src={s.image} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted">
                      /categories/{g.slug}/{s.slug}
                    </p>
                  </div>
                </div>
              )}
            />
          </section>
        );
      })}
    </div>
  );
}
