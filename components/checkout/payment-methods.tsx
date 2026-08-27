import { Smartphone, CreditCard } from "lucide-react";
import clsx from "clsx";
import { Label, Input } from "@/components/ui/field";

export type PaymentMethod = "card" | "mpesa";

export function MethodTabs({
  method,
  onChange,
}: {
  method: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <div className="flex rounded-sm border border-navy/15 p-1 bg-off-white">
      {(
        [
          { id: "mpesa" as const, label: "M-Pesa", icon: Smartphone },
          { id: "card" as const, label: "Card", icon: CreditCard },
        ]
      ).map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold transition-colors",
            method === tab.id ? "bg-navy text-ice" : "text-navy/60 hover:text-navy"
          )}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function MpesaForm({ phone, onPhoneChange }: { phone: string; onPhoneChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor="mpesa-phone">M-Pesa phone number</Label>
      <Input
        id="mpesa-phone"
        type="tel"
        placeholder="07XX XXX XXX"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />
      <p className="mt-2 text-xs text-charcoal/60">
        You&apos;ll get an STK push prompt on your phone to enter your M-Pesa PIN.
      </p>
    </div>
  );
}

export function CardForm({
  card,
  onCardChange,
}: {
  card: { number: string; expiry: string; cvc: string };
  onCardChange: (card: { number: string; expiry: string; cvc: string }) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="card-number">Card number</Label>
        <Input
          id="card-number"
          placeholder="4242 4242 4242 4242"
          value={card.number}
          onChange={(e) => onCardChange({ ...card, number: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-expiry">Expiry</Label>
          <Input
            id="card-expiry"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => onCardChange({ ...card, expiry: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="card-cvc">CVC</Label>
          <Input
            id="card-cvc"
            placeholder="123"
            value={card.cvc}
            onChange={(e) => onCardChange({ ...card, cvc: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
