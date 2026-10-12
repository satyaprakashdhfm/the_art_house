/** Checkout form fields and rules, shared by the checkout page and the placeOrder action. */

export type CheckoutForm = Record<"name" | "phone" | "email" | "address" | "city" | "state" | "pincode", string>;

export function validateCheckoutForm(form: CheckoutForm) {
  const e: Partial<CheckoutForm> = {};
  if (!form.name.trim()) e.name = "Enter your full name";
  if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
  if (!form.address.trim()) e.address = "Enter your address";
  if (!form.city.trim()) e.city = "Enter your city";
  if (!form.state) e.state = "Select your state";
  if (!/^[1-9]\d{5}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
  return e;
}
