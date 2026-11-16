"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

/*
  Aceternity UI Focus Cards, restyled to the company-page tokens (changeui.md, Problem 17):
  4:5 portraits with a 14px radius, name and role below the image (not overlaid), and the
  other cards dim slightly while one is hovered or focused. No blur, no gradient text.
*/

export type FocusCard = {
  id: string
  name: string
  role: string
  photoUrl?: string | null
  /** When present, the card is a button that opens the person's biography. */
  hasDetails?: boolean
}

const Card = React.memo(function Card({
  card,
  index,
  active,
  setActive,
  onSelect,
}: {
  card: FocusCard
  index: number
  active: number | null
  setActive: React.Dispatch<React.SetStateAction<number | null>>
  onSelect?: (card: FocusCard) => void
}) {
  const dimmed = active !== null && active !== index
  const body = (
    <>
      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-surface">
        {card.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.photoUrl} alt={card.name} loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-6xl text-muted-foreground" aria-hidden="true">
            {card.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{card.name}</h3>
      <p className="text-[15px] text-muted-foreground">{card.role}</p>
    </>
  )

  return (
    <li
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={() => setActive(null)}
      className={cn("transition-opacity duration-200", dimmed && "opacity-60")}
    >
      {card.hasDetails && onSelect ? (
        <button type="button" onClick={() => onSelect(card)} className="block w-full rounded-lg text-left">
          {body}
          <span className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
            Read biography<span className="sr-only"> of {card.name}</span>
          </span>
        </button>
      ) : (
        body
      )}
    </li>
  )
})

export function FocusCards({ cards, onSelect }: { cards: FocusCard[]; onSelect?: (card: FocusCard) => void }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={card.id} card={card} index={index} active={active} setActive={setActive} onSelect={onSelect} />
      ))}
    </ul>
  )
}
