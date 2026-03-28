const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Razorpay Checkout script.
 * Caches the promise so subsequent calls reuse the already-loaded script.
 */
export function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay can only be loaded in the browser"));
      return;
    }

    const existing = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Razorpay Checkout script"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}
