import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  name: string;
  email: string;
  title?: string;
  location?: string;
  about?: string;
  phone?: string;
  avatarUri?: string;
};

type AuthState = {
  user: User | null;
  hasOnboarded: boolean;
  hydrated: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setHydrated: (val: boolean) => void;
};

const defaultUser: User = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  title: "Senior Product Designer",
  location: "San Francisco, CA",
  about:
    "Designer with 8+ years crafting intuitive digital products for high-growth startups.",
  phone: "+1 (555) 234-9087",
};

const guestUser: User = {
  name: "Guest User",
  email: "guest@hive.app",
  title: "Exploring Hive",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hasOnboarded: false,
      hydrated: false,
      isAuthenticated: false,

      signIn: async (email: string, _password: string) => {
        const next: User = { ...defaultUser, email };
        set({ user: next, isAuthenticated: true, hasOnboarded: true });
      },

      signUp: async (name: string, email: string, _password: string) => {
        const next: User = { ...defaultUser, name, email };
        set({ user: next, isAuthenticated: true, hasOnboarded: true });
      },

      signOut: async () => {
        set({ user: null, isAuthenticated: false, hasOnboarded: false });
      },

      continueAsGuest: async () => {
        set({ user: guestUser, isAuthenticated: true, hasOnboarded: true });
      },

      updateUser: async (updates: Partial<User>) => {
        const current = get().user;
        if (!current) return;
        const next: User = { ...current, ...updates };
        set({ user: next });
      },

      completeOnboarding: async () => {
        set({ hasOnboarded: true });
      },

      setHydrated: (val: boolean) => {
        set({ hydrated: val });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
