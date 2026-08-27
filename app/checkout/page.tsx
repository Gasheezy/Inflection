import { Suspense } from "react";
import { Metadata } from "next";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout — Inflection",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutClient />
    </Suspense>
  );
}
