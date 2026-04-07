// src/js/ui/renderPosts.js
"use strict";

function summarize(text, maxLen = 140) {
  const t = (text ?? "").trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen).trim() + "…";
}

export function renderPostsList(containerEl, posts, { onViewMore }) {
  containerEl.innerHTML = "";

  for (const p of posts) {
    const card = document.createElement("article");
    card.className = "post";

    const title = document.createElement("h3");
    title.className = "post__title";
    title.textContent = p.title ?? "(sin título)";

    const meta = document.createElement("div");
    meta.className = "post__meta";
    meta.textContent = `Autor: User #${p.userId ?? "N/A"} • Post #${p.id ?? "N/A"}`;

    const body = document.createElement("p");
    body.className = "post__body";
    body.textContent = summarize(p.body, 160);

    const actions = document.createElement("div");
    actions.className = "post__actions";

    const btnMore = document.createElement("button");
    btnMore.className = "btn btn--ghost";
    btnMore.type = "button";
    btnMore.textContent = "Ver más";
    btnMore.addEventListener("click", () => onViewMore?.(p.id));

    actions.appendChild(btnMore);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(body);
    card.appendChild(actions);

    containerEl.appendChild(card);
  }
}