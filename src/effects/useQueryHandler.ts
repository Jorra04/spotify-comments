import { useAuthenticationStore } from "@/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const useQueryHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setBearerToken } = useAuthenticationStore(
    useShallow((state) => state)
  );

  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    const accessToken = params.get("access_token");

    if (accessToken) {
      setBearerToken(accessToken);
      params.delete("access_token");
      router.push(`/search?${params.toString()}`);
    }
  }, [searchParams, router]);
};

export default useQueryHandler;
