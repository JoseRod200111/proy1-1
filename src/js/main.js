"use strict";

import { setState, setText } from "./utils/state.js";
import { createRouter } from "./ui/router.js";
import {
  getPosts,
  searchPosts,
  getPostById,
  getUsers,
  createPost,
} from "./api/postsApi.js";
import { renderPostsList } from "./ui/renderPosts.js";
import { renderDetail } from "./ui/renderDetail.js";
import { renderFavorites } from "./ui/renderAdmin.js";
import {
  getFavorites,
  addFavorite,
  clearFavorites,
  getDeletedIds,
  markDeleted,
} from "./utils/storage.js";
import { validateCreatePost } from "./utils/validators.js";

/* Router */
const router = createRouter();
router.show("home");

/* Home DOM */
const homeState = document.getElementById("home-state");
const homeResults = document.getElementById("home-results");
const homeError = document.getElementById("home-error");
const btnLoad = document.getElementById("btn-load");
const btnHomeRetry = document.getElementById("btn-home-retry");
const btnHomeEmptyRetry = document.getElementById("btn-home-empty-retry");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const pageNowEl = document.getElementById("page-now");
const pageTotalEl = document.getElementById("page-total");

const fQ = document.getElementById("f-q");
const fUser = document.getElementById("f-user");
const fAuthor = document.getElementById("f-author");
const btnApply = document.getElementById("btn-apply-filters");
const btnClear = document.getElementById("btn-clear-filters");

/* Detail DOM */
const detailState = document.getElementById("detail-state");
const detailCard = document.getElementById("detail-card");
const detailError = document.getElementById("detail-error");
const btnDetailRetry = document.getElementById("btn-detail-retry");
const btnFav = document.getElementById("btn-fav");
const btnDelete = document.getElementById("btn-delete");
const detailSuccessMsg = document.getElementById("detail-success-msg");

/* Favorites DOM */
const favState = document.getElementById("fav-state");
const favResults = document.getElementById("fav-results");
const btnFavClear = document.getElementById("btn-fav-clear");

/* Create DOM */
const createForm = document.getElementById("create-form");
const cTitle = document.getElementById("c-title");
const cBody = document.getElementById("c-body");
const cUserId = document.getElementById("c-userId");
const btnCreateClear = document.getElementById("btn-create-clear");

const createState = document.getElementById("create-state");
const createError = document.getElementById("create-error");
const createJson = document.getElementById("create-json");
const createValidation = document.getElementById("create-validation");

/* App state */
const PAGE_SIZE = 6;
let page = 1;
let totalPages = 1;

let currentQuery = "";
let filterUserId = null;
let filterAuthorText = "";

let currentDetailId = null;
let currentDetailPost = null;

let usersById = new Map();
let usersLoaded = false;

function updatePagerUI(totalFiltered) {
  totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  pageNowEl.textContent = String(page);
  pageTotalEl.textContent = String(totalPages);
  btnPrev.disabled = page <= 1;
  btnNext.disabled = page >= totalPages;
}

function getDeletedSet() {
  return new Set(getDeletedIds().map(Number));
}

function getAuthorName(userId) {
  const name = usersById.get(Number(userId));
  return name ?? `User #${userId ?? "N/A"}`;
}

async function ensureUsersLoaded() {
  if (usersLoaded) return;
  const data = await getUsers();
  const users = Array.isArray(data.users) ? data.users : [];
  usersById = new Map(
    users.map((u) => [
      Number(u.id),
      `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
    ])
  );
  usersLoaded = true;
}

function applyFiltersAll(posts) {
  let out = posts;

  const deleted = getDeletedSet();
  out = out.filter((p) => !deleted.has(Number(p.id)));

  if (filterUserId !== null) {
    out = out.filter((p) => Number(p.userId) === Number(filterUserId));
  }

  if (filterAuthorText) {
    const needle = filterAuthorText.toLowerCase();
    out = out.filter((p) =>
      getAuthorName(p.userId).toLowerCase().includes(needle)
    );
  }

  return out;
}

function slicePage(items) {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

async function loadHome() {
  setState(homeState, "loading");
  setText(homeError, "");

  try {
    await ensureUsersLoaded();

    const data = currentQuery
      ? await searchPosts({ q: currentQuery, limit: 150, skip: 0 })
      : await getPosts({ limit: 150, skip: 0 });

    const rawPosts = Array.isArray(data.posts) ? data.posts : [];
    const filtered = applyFiltersAll(rawPosts);

    updatePagerUI(filtered.length);

    const pageItems = slicePage(filtered);
    if (pageItems.length === 0) {
      setState(homeState, "empty");
      return;
    }

    renderPostsList(homeResults, pageItems, {
      onViewMore: (postId) => openDetail(postId),
      authorNameFor: (userId) => getAuthorName(userId),
    });

    setState(homeState, "success");
  } catch (err) {
    setText(homeError, String(err?.message ?? err));
    setState(homeState, "error");
  }
}

async function openDetail(postId) {
  currentDetailId = postId;
  currentDetailPost = null;

  setState(detailState, "loading");
  setText(detailError, "");
  setText(detailSuccessMsg, "");

  router.goDetail();

  try {
    await ensureUsersLoaded();
    const post = await getPostById(postId);

    const deleted = getDeletedSet();
    if (deleted.has(Number(post.id))) {
      setState(detailState, "idle");
      detailCard.innerHTML = "";
      setText(detailSuccessMsg, "Eliminado");
      return;
    }

    currentDetailPost = post;
    post.__authorName = getAuthorName(post.userId);

    renderDetail(detailCard, post);
    setState(detailState, "success");
  } catch (err) {
    setText(detailError, String(err?.message ?? err));
    setState(detailState, "error");
  }
}

function refreshFavoritesView() {
  const favs = getFavorites();

  if (!favs || favs.length === 0) {
    setState(favState, "idle");
    favResults.innerHTML = "";
    return;
  }

  renderFavorites(favResults, favs, { onViewMore: (id) => openDetail(id) });
  setState(favState, "success");
}

/* Create */
async function handleCreateSubmit(e) {
  e.preventDefault();

  const result = validateCreatePost({
    title: cTitle.value,
    body: cBody.value,
    userId: cUserId.value,
  });

  if (!result.ok) {
    createValidation.textContent = result.errors.join(" ");
    return;
  }

  createValidation.textContent = "";
  setState(createState, "loading");
  setText(createError, "");
  if (createJson) createJson.textContent = "";

  try {
    const data = await createPost(result.normalized);
    if (createJson) createJson.textContent = JSON.stringify(data, null, 2);
    setState(createState, "success");
  } catch (err) {
    setText(createError, String(err?.message ?? err));
    setState(createState, "error");
  }
}

function clearCreateForm() {
  cTitle.value = "";
  cBody.value = "";
  cUserId.value = "1";
  createValidation.textContent = "";
  setState(createState, "idle");
  setText(createError, "");
  if (createJson) createJson.textContent = "";
}

/* Events: home */
btnLoad.addEventListener("click", () => {
  page = 1;
  loadHome();
});
btnHomeRetry.addEventListener("click", loadHome);
btnHomeEmptyRetry.addEventListener("click", loadHome);

btnPrev.addEventListener("click", () => {
  if (page > 1) {
    page--;
    loadHome();
  }
});
btnNext.addEventListener("click", () => {
  if (page < totalPages) {
    page++;
    loadHome();
  }
});

btnApply.addEventListener("click", () => {
  currentQuery = (fQ.value ?? "").trim();

  const u = (fUser.value ?? "").trim();
  filterUserId = u ? Number(u) : null;

  filterAuthorText = (fAuthor?.value ?? "").trim();

  page = 1;
  loadHome();
});

btnClear.addEventListener("click", () => {
  fQ.value = "";
  fUser.value = "";
  if (fAuthor) fAuthor.value = "";

  currentQuery = "";
  filterUserId = null;
  filterAuthorText = "";

  page = 1;
  loadHome();
});

/* Events: detail */
btnDetailRetry.addEventListener("click", () => {
  if (currentDetailId) openDetail(currentDetailId);
});

btnFav.addEventListener("click", () => {
  if (!currentDetailPost) return;

  addFavorite({
    id: currentDetailPost.id,
    title: currentDetailPost.title,
    body: currentDetailPost.body,
    userId: currentDetailPost.userId,
  });

  setText(detailSuccessMsg, "Guardado en favoritos");
});

btnDelete.addEventListener("click", () => {
  if (!currentDetailPost) return;

  markDeleted(currentDetailPost.id);
  setText(detailSuccessMsg, "Eliminado");
  loadHome();
});

/* Events: favorites */
btnFavClear.addEventListener("click", () => {
  clearFavorites();
  refreshFavoritesView();
});

document
  .querySelector('[data-route="favorites"]')
  .addEventListener("click", () => refreshFavoritesView());

/* Events: create */
createForm.addEventListener("submit", handleCreateSubmit);
btnCreateClear.addEventListener("click", clearCreateForm);

/* Init */
setState(homeState, "idle");
setState(detailState, "idle");
setState(favState, "idle");
setState(createState, "idle");
updatePagerUI(0);