// src/js/ui/router.js
"use strict";

/**
 * Router simple por "rutas" internas:
 * home | detail | create | favorites
 */

export function createRouter() {
  const views = {
    home: document.getElementById("view-home"),
    detail: document.getElementById("view-detail"),
    create: document.getElementById("view-create"),
    favorites: document.getElementById("view-favorites"),
  };

  const navButtons = Array.from(document.querySelectorAll(".nav__btn"));
  const btnBack = document.getElementById("btn-back");

  function show(route) {
    for (const key of Object.keys(views)) {
      views[key].classList.toggle("hidden", key !== route);
    }

    // activar botón en nav (solo para rutas que estén en nav)
    for (const b of navButtons) {
      b.classList.toggle("is-active", b.dataset.route === route);
    }
  }

  function goHome() { show("home"); }
  function goCreate() { show("create"); }
  function goFavorites() { show("favorites"); }
  function goDetail() { show("detail"); }

  // click en botones nav
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      if (route === "home") goHome();
      if (route === "create") goCreate();
      if (route === "favorites") goFavorites();
    });
  });

  // botón volver desde detalle
  if (btnBack) btnBack.addEventListener("click", goHome);

  return {
    show,
    goHome,
    goCreate,
    goFavorites,
    goDetail,
  };
}