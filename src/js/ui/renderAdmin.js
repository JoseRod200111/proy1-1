// src/js/ui/renderAdmin.js
"use strict";

import { renderPostsList } from "./renderPosts.js";

export function renderFavorites(containerEl, favs, { onViewMore }) {
  // reutilizamos el mismo renderer de posts
  renderPostsList(containerEl, favs, { onViewMore });
}