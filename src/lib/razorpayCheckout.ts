"use client";

// Minimal types for https://checkout.razorpay.com/v1/checkout.js

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailure {
  error: { code: string; description: string; reason?: string; metadata?: { payment_id?: string; order_id?: string } };
}

export interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: { name?: string; contact?: string; email?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (res: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void; confirm_close?: boolean };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", cb: (res: RazorpayFailure) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loading: Promise<void> | undefined;

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = undefined;
      s.remove();
      reject(new Error("Could not load Razorpay. Check your internet connection."));
    };
    document.body.appendChild(s);
  });
  return loading;
}

export function openRazorpay(options: RazorpayOptions, onFailed: (res: RazorpayFailure) => void) {
  if (!window.Razorpay) throw new Error("Razorpay is not loaded");
  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", onFailed);
  rzp.open();
}
