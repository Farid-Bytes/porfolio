"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe reduced-motion preference backed by one shared media-query
 * listener, even when many animated components subscribe to it.
 *
 * The server and the first client render both return `false`, preventing
 * motion props from producing different SSR attributes.
 */
const query = "(prefers-reduced-motion: reduce)";
const subscribers = new Set<() => void>();
let mediaQuery: MediaQueryList | undefined;

function getMediaQuery() {
  mediaQuery ??= window.matchMedia(query);
  return mediaQuery;
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber: () => void) {
  const media = getMediaQuery();

  if (subscribers.size === 0) {
    media.addEventListener("change", notifySubscribers);
  }

  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      media.removeEventListener("change", notifySubscribers);
    }
  };
}

function getSnapshot() {
  return getMediaQuery().matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
