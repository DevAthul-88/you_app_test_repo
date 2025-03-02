import axios from "axios";
import { AuthResponse, LoginRequest, Profile, RegisterRequest, ApiResponse } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers["x-access-token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/api/register", data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/api/login", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ data: Profile }>("/api/getProfile");

    if (!response.data || !response.data.data) {
      throw new Error("No profile data found");
    }

    const profile = response.data.data;

    return {
      email: profile.email,
      username: profile.username,
      gender: profile.gender || undefined,
      name: profile.name || undefined,
      birthday: profile.birthday || undefined,
      height: profile.height || undefined,
      weight: profile.weight || undefined,
      interests: profile.interests || [],
      zodiac: profile.zodiac || undefined,
      horoscope: profile.horoscope || undefined,
    };
  },

  createProfile: async (data: Partial<Profile>) => {
    const response = await api.post<ApiResponse<Profile>>("/api/createProfile", data);
    return response.data;
  },
  
  updateProfile: async (data: Partial<Profile>) => {
    const response = await api.put<ApiResponse<Profile>>("/api/updateProfile", data);
    return response.data;
  },

  
};

export default api;
