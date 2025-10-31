import { create } from "zustand"
import axiosInstance from "../lib/axios"
import { toast } from "react-hot-toast"

export const useUserStore = create((set, get) => ({

    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false })
            toast.error("Password don't match...")
        }

        try {
            const res = await axiosInstance.post("/auth/signup", { name, email, password });
            set({ user: res.data })
        } catch (error) {
            toast.error(error.response.data.message || "Signup Error!")
        } finally{
            set({ loading: false });
        }
    },

    login: async function ({ email, password }) {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            set({ user: res.data })
        } catch (error) {
            toast.error(error.response.data.message || "Login error!")
        } finally{
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout Error!");
            set({ user: null });
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/profile");
            set({ user: response.data });
        } catch (error) {
            console.log(error.message);
            set({ user: null });
        } finally{
            set({checkingAuth : false})
        }
    },
    
    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },

}))