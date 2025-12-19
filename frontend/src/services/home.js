// frontend/src/services/home.js

import { apiFetch } from "./api";

export async function getHomeData() {
  const res = await apiFetch("/home");
  if (!res.ok) throw new Error("Failed to load home data");
  return res.json();
}
