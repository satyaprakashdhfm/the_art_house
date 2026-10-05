"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, CheckCircle2, Frame, Lock, Minus, Plus, Trees, Zap, type LucideIcon } from "lucide-react";
import type { Medium } from "@/types";
import { SIZES, FREE_FRAME_SIZES, EXTRA_SUBJECT_RATE, DETAILED_BACKGROUND_RATE, RUSH_RATE } from "@/data/pricing";
import { MEDIUM_LABELS } from "@/lib/labels";
import { customArtPrice, framePrice } from "@/lib/price";
import { formatINR } from "@/lib/format";
import PhotoDropzone, { type Photo } from "@/components/custom/PhotoDropzone";
import WhatsAppHelp from "@/components/custom/WhatsAppHelp";

const MEDIUM_TEXT: Record<Medium, string> = {
  pencil: "Classic and timeless black & white art",
  oil: "Rich textures and vibrant colours",
  acrylic: "Contemporary and durable finish",
  digital: "High-quality digital illustration",
};

const BACKGROUNDS = { simple: "Simple / plain", artist: "Let the artist suggest" } as const;
const MAX_SUBJECTS = 5;
const NOTES_LIMIT = 500;
const pct = (rate: number) => `+ ${Math.round(rate * 100)}%`;

function SectionTitle({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-3xl">
        {n}. {title}
      </h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  );
}

/** Selectable card used for medium and size. */
function ChoiceCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative border p-4 text-left transition-colors ${
        selected ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"
      }`}
    >
      <span
        className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-paper bg-paper text-ink" : "border-line"
        }`}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}

function AddOn({ icon: Icon, title, text, price, checked, onChange }: { icon: LucideIcon; title: string; text: string; price: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer gap-3 border p-4 transition-colors ${checked ? "border-gold bg-gold/5" : "border-line bg-paper hover:border-ink"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-ink" />
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
        <span className="mt-1 block text-sm font-medium text-gold">{price}</span>
      </span>
    </label>
  );
}

function Field({ id, label, required, children, className = "" }: { id: string; label: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-sale">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function CustomArtForm() {
  const [medium, setMedium] = useState<Medium>("pencil");
  const [size, setSize] = useState("A3");
  const [subjects, setSubjects] = useState(1);
  const [background, setBackground] = useState<keyof typeof BACKGROUNDS>("simple");
  const [detailedBackground, setDetailedBackground] = useState(false);
  const [frame, setFrame] = useState(false);
  const [rush, setRush] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notes, setNotes] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const sizes = SIZES[medium].filter((s) => s.key !== "FILE");
  const sizeInfo = sizes.find((s) => s.key === size);
  const quote = customArtPrice({ medium, size, subjects, detailedBackground, frame, rush });
  const freeFrame = FREE_FRAME_SIZES.includes(size);
  const addOns = [frame && "Frame", rush && "Rush order", detailedBackground && "Detailed background"].filter(Boolean);

  // Release preview object URLs when the component unmounts.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function changeMedium(m: Medium) {
    setMedium(m);
    const keys = SIZES[m].map((s) => s.key);
    if (!keys.includes(size) || size === "FILE") setSize(m === "pencil" || m === "digital" ? "A3" : "18x24");
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-card p-12 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.25} />
        <h2 className="mt-4 font-serif text-3xl">Request received!</h2>
        <p className="mt-3 text-muted">
          Request ID <span className="font-medium text-ink">{submittedId}</span>. Our artist will contact you on WhatsApp
          within 24 hours with a confirmed quote and timeline.
        </p>
        <p className="mt-4 text-xs text-muted">Demo store — nothing was uploaded or charged.</p>
        <button type="button" className="btn-outline mt-8" onClick={() => setSubmittedId(null)}>
          Submit another request
        </button>
      </div>
    );
  }

  const summary: [string, string][] = [
    ["Medium", MEDIUM_LABELS[medium]],
    ["Size", sizeInfo ? `${sizeInfo.label}${sizeInfo.detail !== "Canvas" ? ` (${sizeInfo.detail})` : " canvas"}` : size],
    ["People / Pets", String(subjects)],
    ["Background", detailedBackground ? "Detailed scene" : BACKGROUNDS[background]],
    ["Add-ons", addOns.length ? addOns.join(", ") : "None"],
  ];

  return (
    <form
      className="grid gap-12 lg:grid-cols-[1fr_400px]"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmittedId(`CUS-${Date.now().toString(36).toUpperCase()}`);
        photos.forEach((p) => URL.revokeObjectURL(p.url));
        setPhotos([]);
      }}
    >
      <div className="min-w-0 space-y-16">
        {/* 1. Artwork */}
        <section>
          <SectionTitle n={1} title="Choose your artwork" text="Select the medium, size and details for your custom painting." />
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-medium">Medium</p>
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {(Object.keys(MEDIUM_LABELS) as Medium[]).map((m) => (
                  <ChoiceCard key={m} selected={medium === m} onClick={() => changeMedium(m)}>
                    <span className="block pr-6 font-serif text-xl">{MEDIUM_LABELS[m]}</span>
                    <span className={`mt-1 block text-xs leading-relaxed ${medium === m ? "text-paper/75" : "text-muted"}`}>{MEDIUM_TEXT[m]}</span>
                  </ChoiceCard>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Size</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {sizes.map((s) => (
                  <ChoiceCard key={s.key} selected={size === s.key} onClick={() => setSize(s.key)}>
                    <span className="block pr-6 font-medium">{s.label}</span>
                    <span className={`mt-0.5 block text-xs ${size === s.key ? "text-paper/75" : "text-muted"}`}>{s.detail}</span>
                  </ChoiceCard>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium">Number of people / pets</p>
                <div className="flex h-12 items-stretch border border-line bg-paper">
                  <button
                    type="button"
                    aria-label="Fewer"
                    disabled={subjects <= 1}
                    onClick={() => setSubjects((n) => n - 1)}
                    className="w-12 text-gold transition-colors hover:bg-card disabled:text-line"
                  >
                    <Minus className="mx-auto h-4 w-4" />
                  </button>
                  <output aria-live="polite" className="flex flex-1 items-center justify-center border-x border-line font-medium">
                    {subjects}
                  </output>
                  <button
                    type="button"
                    aria-label="More"
                    disabled={subjects >= MAX_SUBJECTS}
                    onClick={() => setSubjects((n) => n + 1)}
                    className="w-12 text-gold transition-colors hover:bg-card disabled:text-line"
                  >
                    <Plus className="mx-auto h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  e.g. 1 person, 2 people, 1 pet. Each extra adds {Math.round(EXTRA_SUBJECT_RATE * 100)}%.
                </p>
              </div>
              <div>
                <label htmlFor="background" className="mb-3 block text-sm font-medium">
                  Background
                </label>
                <select id="background" value={background} onChange={(e) => setBackground(e.target.value as keyof typeof BACKGROUNDS)} className="input h-12">
                  {Object.entries(BACKGROUNDS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-muted">Choose a background or let our artists suggest one.</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">
                Add-ons <span className="font-normal text-muted">(optional)</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <AddOn icon={Frame} title="Framing" text="High-quality wooden frame" price={freeFrame ? "Free on this size" : `+ ${formatINR(framePrice(size))}`} checked={frame} onChange={setFrame} />
                <AddOn icon={Zap} title="Rush order (7 days)" text="Get your artwork faster" price={pct(RUSH_RATE)} checked={rush} onChange={setRush} />
                <AddOn icon={Trees} title="Detailed background" text="Complex scenery or setting" price={pct(DETAILED_BACKGROUND_RATE)} checked={detailedBackground} onChange={setDetailedBackground} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Photos */}
        <section id="upload" className="scroll-mt-28">
          <SectionTitle n={2} title="Upload your photos" text={`Clear, well-lit photos work best. You can upload up to 5 images.`} />
          <PhotoDropzone photos={photos} onChange={setPhotos} />
        </section>

        {/* 3. Details */}
        <section>
          <SectionTitle n={3} title="Your details" text="We'll confirm everything with you on WhatsApp before we start." />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <Field id="c-name" label="Full name" required>
              <input id="c-name" required className="input h-12" autoComplete="name" placeholder="Enter your full name" />
            </Field>
            <Field id="c-phone" label="Phone number" required>
              <input id="c-phone" type="tel" required pattern="[6-9][0-9]{9}" inputMode="numeric" maxLength={10} title="10-digit mobile number" className="input h-12" autoComplete="tel-national" placeholder="10-digit mobile number" />
            </Field>
            <Field id="c-email" label="Email address" required>
              <input id="c-email" type="email" required className="input h-12" autoComplete="email" placeholder="you@example.com" />
            </Field>
            <Field id="c-whatsapp" label="WhatsApp number" required>
              <input id="c-whatsapp" type="tel" required pattern="[6-9][0-9]{9}" inputMode="numeric" maxLength={10} title="10-digit mobile number" className="input h-12" placeholder="Where we'll send your preview" />
            </Field>
            <Field id="c-address" label="Delivery address" required className="sm:col-span-2">
              <input id="c-address" required className="input h-12" autoComplete="street-address" placeholder="House no., area, city, state, pincode" />
            </Field>
            <Field id="c-occasion" label="Occasion">
              <select id="c-occasion" className="input h-12" defaultValue="">
                <option value="">Select (optional)</option>
                {["Birthday", "Anniversary", "Wedding", "Housewarming", "Memorial", "Festival", "Just because"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field id="c-deadline" label="Needed by">
              <input id="c-deadline" type="date" className="input h-12" />
            </Field>
            <Field id="c-notes" label="Special instructions" className="sm:col-span-2">
              <textarea
                id="c-notes"
                rows={4}
                maxLength={NOTES_LIMIT}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input resize-y"
                placeholder="e.g. background ideas, colour preferences, text to include…"
              />
              <p className="mt-1 text-right text-xs text-muted">
                {notes.length}/{NOTES_LIMIT}
              </p>
            </Field>
          </div>
        </section>
      </div>

      {/* Live estimate */}
      <aside className="h-fit space-y-4 lg:sticky lg:top-28">
        <div className="border border-line bg-card p-7 shadow-sm">
          <p className="eyebrow">Your estimate</p>
          <p className="mt-2 font-serif text-5xl">{formatINR(quote.total)}</p>
          <dl className="mt-6 space-y-2.5 text-sm">
            {summary.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt>Artwork price</dt>
              <dd>{formatINR(quote.painting)}</dd>
            </div>
            {frame && (
              <div className="flex justify-between">
                <dt>Frame</dt>
                <dd>{quote.frame === 0 ? "Free" : formatINR(quote.frame)}</dd>
              </div>
            )}
            <div className="flex justify-between bg-paper px-3 py-2.5 font-medium">
              <dt>Advance to start (50%)</dt>
              <dd className="text-gold-dark">{formatINR(quote.advance)}</dd>
            </div>
          </dl>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            {["Free digital preview before painting", "2 free revisions", `Delivery in ${rush ? "7–10" : "12–18"} days`, "Carefully packed and shipped to your door"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-gold" /> {t}
              </li>
            ))}
          </ul>
          {photos.length === 0 ? (
            <button
              type="button"
              onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary mt-7 w-full py-4 text-sm"
            >
              Continue to upload photos <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn-primary mt-7 w-full py-4 text-sm">
              Submit request <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="h-3 w-3" /> Nothing is charged until you approve the quote
          </p>
        </div>
        <WhatsAppHelp />
      </aside>
    </form>
  );
}
