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
            set({ user: res.data, loading: false })
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured try again...")
        }
    },

    login: async function ({ email, password }) {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            set({ user: res.data, loading: false })

        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured try again...")
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },

}))