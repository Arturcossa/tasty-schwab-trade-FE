"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/strategy-control");
    }
  }, [router, isRedirecting]);

  return null;
};

export default Page;