/** Browser side of Razorpay Standard Checkout: loads checkout.js once and exposes its (minimal) types. */

export type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
export type RazorpayFailure = { error: { code: string; description: string; reason: string } };

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: "INR";
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void; confirm_close?: boolean };
};

type RazorpayInstance = {
  open(): void;
  on(event: "payment.failed", cb: (response: RazorpayFailure) => void): void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("Could not load Razorpay"));
    };
    document.body.appendChild(script);
  });
  return loading;
}

export async function createRazorpay(options: RazorpayOptions) {
  await loadRazorpay();
  return new window.Razorpay!(options);
}
