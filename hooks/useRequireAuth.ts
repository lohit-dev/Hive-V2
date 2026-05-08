import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

export function useRequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const requireAuth = (action: () => void, message?: string) => {
    if (!isAuthenticated || user?.email === "guest@hive.app") {
      // User is not authenticated or is a guest
      router.push("/auth/login");
      return false;
    }
    action();
    return true;
  };

  const isGuest = user?.email === "guest@hive.app";
  const isFullyAuthenticated = isAuthenticated && !isGuest;

  return {
    isAuthenticated,
    isGuest,
    isFullyAuthenticated,
    requireAuth,
  };
}
