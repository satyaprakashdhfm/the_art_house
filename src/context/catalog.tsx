"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SiteData } from "@/types";
import { createCatalog, type Catalog } from "@/lib/catalog";

const CatalogContext = createContext<Catalog | null>(null);

/** Makes the server-loaded site data available to Client Components. */
export function CatalogProvider({ data, children }: { data: SiteData; children: ReactNode }) {
  const catalog = useMemo(() => createCatalog(data), [data]);
  return <CatalogContext value={catalog}>{children}</CatalogContext>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return catalog;
}
