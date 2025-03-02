import { User } from "@/types/auth";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: User | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
      user: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem("token");
        toast.success('Logout Successfull');
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
