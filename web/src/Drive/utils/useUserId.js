import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3300";

export default function useUserId() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const jwt = localStorage.getItem("token");
        if (!jwt) {
          navigate("/signin", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/api/tokens`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
          }
          return;
        }

        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
      }
    };

    fetchUserId();
  }, [navigate]);

  return userId;
}
