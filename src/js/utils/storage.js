"use strict";

const KEY_FAVS = "p1_favorites";
const KEY_DELETED = "p1_deleted";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/*  Favoritos  */
export function getFavorites() {
  return readJson(KEY_FAVS, []);
}

export function addFavorite(post) {
  const favs = getFavorites();
  const exists = favs.some((p) => Number(p.id) === Number(post.id));
  if (!exists) {
    favs.unshift(post);
    writeJson(KEY_FAVS, favs);
  }
  return favs;
}

export function clearFavorites() {
  writeJson(KEY_FAVS, []);
}

/*  Eliminados (simulado)  */
export function getDeletedIds() {
  return readJson(KEY_DELETED, []);
}

export function markDeleted(id) {
  const ids = getDeletedIds();
  const n = Number(id);
  if (!ids.includes(n)) {
    ids.push(n);
    writeJson(KEY_DELETED, ids);
  }
  return ids;
}