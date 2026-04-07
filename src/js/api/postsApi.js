// src/js/api/postsApi.js
"use strict";

/**
 * API: DummyJSON Posts + Users
 */

const API_BASE = "https://dummyjson.com";

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await safeJson(res);
    const msg = data?.message ? String(data.message) : `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return res.json();
}

//  POSTS 
export async function getPosts({ limit = 6, skip = 0 } = {}) {
  const url = `${API_BASE}/posts?limit=${encodeURIComponent(limit)}&skip=${encodeURIComponent(skip)}`;
  return request(url);
}

export async function searchPosts({ q, limit = 6, skip = 0 } = {}) {
  const url = `${API_BASE}/posts/search?q=${encodeURIComponent(q ?? "")}&limit=${encodeURIComponent(limit)}&skip=${encodeURIComponent(skip)}`;
  return request(url);
}

export async function getPostById(id) {
  const url = `${API_BASE}/posts/${encodeURIComponent(id)}`;
  return request(url);
}

export async function createPost({ title, body, userId }) {
  const url = `${API_BASE}/posts/add`;
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId }),
  });
}

//  USERS 
export async function getUsers() {
  const url = `${API_BASE}/users?limit=200&skip=0`;
  return request(url);
}