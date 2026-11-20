"use client";

import { useSyncExternalStore } from "react";
import type { LevelId, PlanId } from "./site";

/**
 * Tiny shared store: the pricing tickets and the hero level rail write here,
 * the sign-up form reads from here. No context provider, no library.
 */
type Selection = { plan: PlanId | ""; level: LevelId };

let state: Selection = { plan: "", level: "unknown" };
const initial: Selection = state;
const listeners = new Set<() => void>();

export function setSelection(patch: Partial<Selection>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSelection(): Selection {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}
