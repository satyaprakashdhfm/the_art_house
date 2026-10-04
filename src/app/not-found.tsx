import Link from "next/link";
import StoreShell from "@/components/layout/StoreShell";

export default function NotFound() {
  return (
    <StoreShell>
      <div className="container-page py-28 text-center">
        <p className="eyebrow">404</p>
        <h1 className="heading mt-3">This canvas is blank</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/shop" className="btn-outline">
            Shop paintings
          </Link>
        </div>
      </div>
    </StoreShell>
  );
}
