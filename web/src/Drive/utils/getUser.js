import Regex from "./regex";

const API_BASE = import.meta.env.API_BASE_URL || "http://localhost:3300";


async function getUser(owner) {
  if(!Regex.id.test(owner)) return owner;
  const res = await fetch(`${API_BASE}/api/users/${owner}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
  })
  if(!res.ok) {
    const txt = await res.text();
    throw new Error(`Get user failed (HTTP ${res.status}): ${txt}`);
  }
  const user = await res.json();
  return user.username || "Unknown";
}

export default getUser;