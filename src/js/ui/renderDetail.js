// src/js/ui/renderDetail.js
"use strict";

export function renderDetail(containerEl, post) {
  containerEl.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "post__title";
  title.textContent = post.title ?? "(sin título)";

  const meta = document.createElement("div");
  meta.className = "post__meta";
  meta.textContent = `Autor: User #${post.userId ?? "N/A"} • Post #${post.id ?? "N/A"}`;

  const body = document.createElement("p");
  body.className = "post__body";
  body.textContent = post.body ?? "";

  containerEl.appendChild(title);
  containerEl.appendChild(meta);
  containerEl.appendChild(body);
}