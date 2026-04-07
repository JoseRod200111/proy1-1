// src/js/utils/state.js
"use strict";

/**
 * Manejo de UI States con clases:
 * state--idle | state--loading | state--success | state--empty | state--error
 */

export function setState(containerEl, stateName) {
  if (!containerEl) return;
  containerEl.classList.remove(
    "state--idle",
    "state--loading",
    "state--success",
    "state--empty",
    "state--error"
  );
  containerEl.classList.add(`state--${stateName}`);
}

export function setText(el, text) {
  if (!el) return;
  el.textContent = text ?? "";
}