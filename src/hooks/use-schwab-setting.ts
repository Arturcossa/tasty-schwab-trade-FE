"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function UseSchwabSetting() {
  const [authorizationURL, setAuthorizationURL] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuthorizationURL = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schwab/authorize-url`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
        const url = await response.text();
        setAuthorizationURL(url);
      } else {
        console.error("Failed to fetch schwab authorization URL:", response.status);
      }
    };

    fetchAuthorizationURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { authorizationURL, setAuthorizationURL };
}
