"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { ui } from "@/context/ui";
import { deleteRow, reorder, saveRow, setFlag, type TableName } from "@/app/admin/actions";
import { Chips, Field, Toggle } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useConfirm } from "@/components/admin/useConfirm";

type Row = Record<string, unknown>;
type Option = { value: string; label: string };

type Base<R> = { name: keyof R & string; label: string; help?: string; wide?: boolean };
export type FieldDef<R> =
  | (Base<R> & {
      type: "text" | "textarea" | "number";
      required?: boolean;
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      /** Primary keys such as coupon codes can't change after creation. */
      lockOnEdit?: boolean;
      uppercase?: boolean;
    })
  | (Base<R> & { type: "select"; options: Option[] })
  | (Base<R> & { type: "toggle" })
  | (Base<R> & { type: "image"; folder: string; aspect?: string })
  | (Base<R> & { type: "chips"; options: Option[] });

type Props<R extends Row> = {
  table: TableName;
  rows: R[];
  keyField: keyof R & string;
  /** Singular label, e.g. "slide". */
  itemName: string;
  fields: FieldDef<R>[];
  defaults: R;
  renderItem: (row: R) => ReactNode;
  /** Quick on/off switches shown on each row. */
  flags?: { field: keyof R & string; label: string }[];
  sortable?: boolean;
  searchable?: (row: R) => string;
  validate?: (row: R) => string | null;
  emptyText?: string;
  canAdd?: boolean;
  canDelete?: boolean;
};

export default function CollectionManager<R extends Row>({
  table,
  rows,
  keyField,
  itemName,
  fields,
  defaults,
  renderItem,
  flags = [],
  sortable = true,
  searchable,
  validate,
  emptyText,
  canAdd = true,
  canDelete = true,
}: Props<R>) {
  // Local copy for instant feedback; replaced whenever the server sends fresh rows.
  const [items, setItems] = useState(rows);
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setItems(rows);
  }

  const [editing, setEditing] = useState<{ original: R | null; draft: R } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [saving, startSaving] = useTransition();
  const [, startBackground] = useTransition();
  const { confirm, dialog } = useConfirm();

  const keyOf = (r: R) => String(r[keyField]);
  const q = query.trim().toLowerCase();
  const visible = searchable && q ? items.filter((r) => searchable(r).toLowerCase().includes(q)) : items;

  function open(original: R | null) {
    setError(null);
    setEditing({ original, draft: { ...(original ?? defaults) } });
  }

  function set<K extends keyof R>(name: K, value: R[K]) {
    setEditing((e) => (e ? { ...e, draft: { ...e.draft, [name]: value } } : e));
  }

  function save() {
    if (!editing) return;
    for (const f of fields) {
      if ("required" in f && f.required && !String(editing.draft[f.name] ?? "").trim()) {
        return setError(`${f.label} is required.`);
      }
    }
    const problem = validate?.(editing.draft);
    if (problem) return setError(problem);

    startSaving(async () => {
      const res = await saveRow(table, editing.draft, editing.original ? keyOf(editing.original) : undefined);
      if (!res.ok) return setError(res.error);
      setEditing(null);
      ui.toast(editing.original ? "Changes saved" : `New ${itemName} added`);
    });
  }

  async function remove(r: R) {
    const ok = await confirm({
      title: `Delete this ${itemName}?`,
      message: "This can't be undone. It will disappear from the website straight away.",
    });
    if (!ok) return;
    setItems((list) => list.filter((x) => keyOf(x) !== keyOf(r)));
    startBackground(async () => {
      const res = await deleteRow(table, keyOf(r));
      ui.toast(res.ok ? `${itemName[0].toUpperCase()}${itemName.slice(1)} deleted` : res.error);
      if (!res.ok) setItems(rows);
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setItems(next);
    startBackground(async () => {
      const res = await reorder(table, next.map(keyOf));
      if (!res.ok) {
        ui.toast(res.error);
        setItems(rows);
      }
    });
  }

  function toggle(r: R, field: keyof R & string) {
    const value = !r[field];
    setItems((list) => list.map((x) => (keyOf(x) === keyOf(r) ? { ...x, [field]: value } : x)));
    startBackground(async () => {
      const res = await setFlag(table, keyOf(r), field, value);
      if (!res.ok) {
        ui.toast(res.error);
        setItems(rows);
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">
            {items.length} {itemName}
            {items.length === 1 ? "" : "s"}
          </p>
          {searchable && items.length > 6 && (
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="input w-56 py-2 pl-9"
              />
            </div>
          )}
        </div>
        {canAdd && (
          <button type="button" onClick={() => open(null)} className="btn-primary px-4 py-2.5">
            <Plus className="h-4 w-4" /> Add {itemName}
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="border border-dashed border-line bg-paper py-16 text-center">
          <p className="font-serif text-lg">{q ? "No matches" : (emptyText ?? `No ${itemName}s yet`)}</p>
          {!q && canAdd && (
            <button type="button" onClick={() => open(null)} className="btn-outline mt-5 px-4 py-2">
              <Plus className="h-4 w-4" /> Add the first one
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-line border border-line bg-paper">
          {visible.map((r) => {
            const index = items.indexOf(r);
            return (
              <li key={keyOf(r)} className="flex flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap">
                {sortable && !q && (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label="Move up"
                      className="p-0.5 text-muted hover:text-ink disabled:opacity-25"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Move down"
                      className="p-0.5 text-muted hover:text-ink disabled:opacity-25"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => open(r)} className="min-w-0 flex-1 text-left">
                  {renderItem(r)}
                </button>
                <div className="flex items-center gap-4">
                  {flags.map((f) => (
                    <div key={f.field} className="flex flex-col items-center gap-1">
                      <Toggle checked={!!r[f.field]} onChange={() => toggle(r, f.field)} />
                      <span className="text-[10px] tracking-wide text-muted uppercase">{f.label}</span>
                    </div>
                  ))}
                  <button type="button" onClick={() => open(r)} aria-label="Edit" className="p-2 text-muted hover:text-ink">
                    <Pencil className="h-4 w-4" />
                  </button>
                  {canDelete && (
                    <button type="button" onClick={() => remove(r)} aria-label="Delete" className="p-2 text-muted hover:text-sale">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Drawer
        open={!!editing}
        onClose={() => !saving && setEditing(null)}
        title={editing?.original ? `Edit ${itemName}` : `New ${itemName}`}
        wide
        footer={
          <div className="flex items-center justify-between gap-3">
            {error ? <p className="text-sm text-sale">{error}</p> : <span />}
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(null)} disabled={saving} className="btn-outline px-4 py-2.5">
                Cancel
              </button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-5 py-2.5">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        }
      >
        {editing && (
          <form
            className="grid gap-5 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {fields.map((f) => {
              const value = editing.draft[f.name];
              const span = f.wide || f.type === "textarea" || f.type === "image" || f.type === "chips" ? "sm:col-span-2" : "";
              switch (f.type) {
                case "toggle":
                  return (
                    <div key={f.name} className={span || "sm:col-span-2"}>
                      <Toggle checked={!!value} onChange={(v) => set(f.name, v as R[typeof f.name])} label={f.label} help={f.help} />
                    </div>
                  );
                case "image":
                  return (
                    <div key={f.name} className={span}>
                      <span className="label">{f.label}</span>
                      <ImageUpload
                        value={String(value ?? "")}
                        onChange={(url) => set(f.name, url as R[typeof f.name])}
                        folder={f.folder}
                        aspect={f.aspect}
                      />
                      {f.help && <span className="mt-1 block text-xs text-muted">{f.help}</span>}
                    </div>
                  );
                case "chips":
                  return (
                    <div key={f.name} className={span}>
                      <span className="label">{f.label}</span>
                      <Chips
                        options={f.options}
                        value={(value as string[]) ?? []}
                        onChange={(v) => set(f.name, v as R[typeof f.name])}
                      />
                      {f.help && <span className="mt-1 block text-xs text-muted">{f.help}</span>}
                    </div>
                  );
                case "select":
                  return (
                    <Field key={f.name} label={f.label} help={f.help} className={span}>
                      <select
                        value={String(value ?? "")}
                        onChange={(e) => set(f.name, e.target.value as R[typeof f.name])}
                        className="input"
                      >
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  );
                case "textarea":
                  return (
                    <Field key={f.name} label={f.label} help={f.help} className={span}>
                      <textarea
                        value={String(value ?? "")}
                        onChange={(e) => set(f.name, e.target.value as R[typeof f.name])}
                        placeholder={f.placeholder}
                        rows={4}
                        className="input resize-y"
                      />
                    </Field>
                  );
                default: {
                  const locked = f.lockOnEdit && !!editing.original;
                  return (
                    <Field key={f.name} label={f.label} help={locked ? "Can't be changed after creating." : f.help} className={span}>
                      <input
                        type={f.type}
                        value={value === null || value === undefined ? "" : String(value)}
                        onChange={(e) => {
                          const raw = f.uppercase ? e.target.value.toUpperCase() : e.target.value;
                          const v = f.type === "number" ? (raw === "" ? null : Number(raw)) : raw;
                          set(f.name, v as R[typeof f.name]);
                        }}
                        placeholder={f.placeholder}
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        disabled={locked}
                        className={`input disabled:bg-card disabled:text-muted ${f.uppercase ? "uppercase" : ""}`}
                      />
                    </Field>
                  );
                }
              }
            })}
            <button type="submit" hidden />
          </form>
        )}
      </Drawer>
      {dialog}
    </div>
  );
}
