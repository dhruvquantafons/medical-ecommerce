"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import { StatefulButton } from "@/components/ui/stateful-button";

/**
 * The "Add" control on product cards: an Aceternity Stateful Button (adding, then "Added" with a check).
 * It sits above the card's stretched link, so pressing it never navigates. Once the product is in the
 * cart, a small link shows how many and leads to the cart.
 */
export function CardAddButton({ productId, productName }: { productId: string; productName: string }) {
  const hydrated = useHydrated();
  const qty = useCart((s) => s.items.find((i) => i.productId === productId)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const inCart = hydrated ? qty : 0;

  return (
    <div className="relative z-10 flex flex-col items-end gap-1">
      <StatefulButton onClick={() => add(productId)} successLabel="Added" aria-label={`Add ${productName} to cart`}>
        Add
      </StatefulButton>
      {inCart > 0 && (
        <Link href="/cart" className="text-sm text-ink-muted underline-offset-4 hover:text-brand hover:underline">
          {inCart} in cart
        </Link>
      )}
    </div>
  );
}
