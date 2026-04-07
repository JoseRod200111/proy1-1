// src/js/utils/validators.js
"use strict";

export function validateCreatePost({ title, body, userId }) {
  const errors = [];

  const t = (title ?? "").trim();
  const b = (body ?? "").trim();
  const u = Number(userId);

  if (!t) errors.push("Título es obligatorio.");
  if (t && t.length < 5) errors.push("Título debe tener al menos 5 caracteres.");

  if (!b) errors.push("Contenido es obligatorio.");
  if (b && b.length < 20) errors.push("Contenido debe tener al menos 20 caracteres.");

  if (!Number.isFinite(u) || u <= 0) errors.push("User ID debe ser un número mayor a 0.");

  return {
    ok: errors.length === 0,
    errors,
    normalized: { title: t, body: b, userId: u },
  };
}