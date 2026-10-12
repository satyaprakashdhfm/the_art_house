"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkOrderPayment } from "@/app/(store)/checkout/actions";
import { completeOrder, pendingPayment } from "@/context/cart";
import { checkoutWindow } from "@/lib/razorpay-checkout";

/** How long after opening the payment window we keep checking whether it was paid. */
const WINDOW_MS = 30 * 60_000;

/**
 * On a phone, paying by UPI switches to the payment app, and the browser may reload this tab or
 * never run Checkout's success handler. When the shopper comes back, ask the server whether the
 * order was paid and, if so, finish it here: empty the cart and show the confirmation.
 */
export default function PendingPaymentCheck() {
  const router = useRouter();

  useEffect(() => {
    let busy = false;

    async function check() {
      const pending = pendingPayment.get();
      // While the payment window is open it reports the result itself.
      if (!pending || busy || checkoutWindow.open) return;
      if (Date.now() - pending.startedAt > WINDOW_MS) return pendingPayment.clear();
      busy = true;
      try {
        const { status } = await checkOrderPayment(pending.order.id);
        if (status === "paid") {
          completeOrder(pending.order);
          router.push("/order-success");
        } else if (status === "unknown") {
          pendingPayment.clear();
        }
      } catch {
        // Offline or server error: try again next time the page is shown.
      } finally {
        busy = false;
      }
    }

    check();
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [router]);

  return null;
}
