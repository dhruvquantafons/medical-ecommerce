"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after hydration, so persisted (localStorage) state never mismatches the server HTML. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
