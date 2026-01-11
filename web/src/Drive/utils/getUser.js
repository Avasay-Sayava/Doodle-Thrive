import Regex from "../utils/regex";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3300";


async function getUser(user) {
  if(!Regex.id.test(user)) return user;
  const res = await fetch(`${API_BASE}/api/users/${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
  })
  if(!res.ok) {
    const txt = await res.text();
    throw new Error(`Get user failed (HTTP ${res.status}): ${txt}`);
  }
  user = await res.json();
  return user.username || "Unknown";
}

export default getUser;
