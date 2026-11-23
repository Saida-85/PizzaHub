"use client";

import { useEffect, useSyncExternalStore } from "react";
import { api } from "@/lib/api";

// A tiny shared store so every heart button on a page uses ONE favorites request.

interface Snapshot {
  ids: Set<string>;
  loaded: boolean;
}

let ids = new Set<string>();
let loaded = false;
let loadedFor: string | null = null;
let inflight: Promise<void> | null = null;
let snapshot: Snapshot = { ids, loaded };
const serverSnapshot: Snapshot = { ids: new Set(), loaded: false };
const listeners = new Set<() => void>();

function emit() {
  snapshot = { ids: new Set(ids), loaded };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function reset() {
  if (loadedFor === null && !loaded && ids.size === 0) return;
  ids = new Set();
  loaded = false;
  loadedFor = null;
  inflight = null;
  emit();
}

function load(userId: string) {
  // A different user signed in on the same tab: forget the previous user's favorites.
  if (loadedFor !== null && loadedFor !== userId) reset();
  if (loaded && loadedFor === userId) return Promise.resolve();

  if (!inflight) {
    loadedFor = userId;
    inflight = api
      .get<{ ids: string[] }>("/api/favorites/ids")
      .then((r) => {
        ids = new Set(r.ids);
        loaded = true;
        emit();
      })
      .catch(() => {
        loadedFor = null;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

// Adds or removes a favorite. Returns the new state (true = now a favorite).
async function toggle(itemId: string): Promise<boolean> {
  const wasFavorite = ids.has(itemId);

  if (wasFavorite) ids.delete(itemId);
  else ids.add(itemId);
  emit();

  try {
    if (wasFavorite) await api.delete(`/api/favorites/${itemId}`);
    else await api.post(`/api/favorites/${itemId}`);
    return !wasFavorite;
  } catch (e) {
    // Roll back the optimistic change
    if (wasFavorite) ids.add(itemId);
    else ids.delete(itemId);
    emit();
    throw e;
  }
}

// Pass the customer's user id to load their favorites, or undefined to clear the store.
export function useFavorites(customerId?: string) {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );

  useEffect(() => {
    if (customerId) void load(customerId);
    else reset();
  }, [customerId]);

  return { ids: state.ids, loaded: state.loaded, toggle };
}