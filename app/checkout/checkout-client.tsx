"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Label, Input } from "@/components/ui/field";
import { OrderSummary } from "@/components/checkout/order-summary";
import { MethodTabs, MpesaForm, CardForm, PaymentMethod } from "@/components/checkout/payment-methods";
import { TIERS, isTierId } from "@/lib/tiers";
import { createSession, saveSession } from "@/lib/session-store";

const ENFORCE_PAYMENT = process.env.NEXT_PUBLIC_ENFORCE_PAYMENT === "true";

export default function CheckoutClient() {
  const router = useRouter();
  const params = useSearchParams();
  const tierParam = params.get("tier") ?? "position";
  const tierId = isTierId(tierParam) ? tierParam : "position";
  const tier = TIERS[tierId];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function proceedToFlow(eventType: "paid" | "skipped") {
    if (!email) {
      setError("Enter your email so we can send your report.");
      return;
    }
    setError(null);
    setProcessing(true);

    const session = createSession(tierId, { name, email, paymentStatus: eventType });
    saveSession(session);

    try {
      await Promise.all([
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, tier: tierId, sessionId: session.sessionId }),
        }),
        fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.sessionId, tier: tierId, email, eventType }),
        }),
      ]);
    } catch {
      // Best-effort logging — never block the user's flow on it.
    }

    router.push(`/flow/${tierId}?session=${session.sessionId}`);
  }

  async function handlePay() {
    if (ENFORCE_PAYMENT) {
      // TODO: wire real payment processor (Paystack/IntaSend/M-Pesa recommended for Kenya)
      setError("Live payment isn't wired up yet. Flip NEXT_PUBLIC_ENFORCE_PAYMENT off to continue in beta mode.");
      return;
    }
    // Simulate a brief processing delay so the mock feels real, then proceed
    // without an actual charge.
    await new Promise((r) => setTimeout(r, 900));
    await proceedToFlow("paid");
  }

  return (
    <>
      <Header minimal />
      <main className="flex-1 bg-off-white py-16">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
              <OrderSummary tier={tier} />
            </div>

            <div className="lg:col-span-3 rounded-md bg-white p-8 ring-1 ring-navy/10">
              <h1 className="font-display text-2xl text-navy">Checkout</h1>
              <p className="mt-1 text-sm text-charcoal/60">
                We&apos;ll use these details to send your positioning report.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Wanjiku"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <Label>Payment method</Label>
                <MethodTabs method={method} onChange={setMethod} />
                <div className="mt-5">
                  {method === "mpesa" ? (
                    <MpesaForm phone={phone} onPhoneChange={setPhone} />
                  ) : (
                    <CardForm card={card} onCardChange={setCard} />
                  )}
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-8 space-y-3">
                <Button onClick={handlePay} disabled={processing} className="w-full">
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    `Pay KES ${tier.priceKES.toLocaleString()}`
                  )}
                </Button>

                {!ENFORCE_PAYMENT && (
                  <Button
                    variant="outline-navy"
                    disabled={processing}
                    onClick={() => proceedToFlow("skipped")}
                    className="w-full"
                  >
                    Skip Payment (Beta Access)
                  </Button>
                )}
              </div>

              <p className="mt-5 flex items-center gap-2 text-xs text-charcoal/50">
                <ShieldCheck className="h-4 w-4" />
                {ENFORCE_PAYMENT
                  ? "Payments are processed securely."
                  : "Beta mode: no real charge is made in v1."}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
