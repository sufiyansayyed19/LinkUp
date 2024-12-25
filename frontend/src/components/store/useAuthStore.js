import { create } from "zustand";
import { axiosInstance } from "../../lib/axios.js";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile : false,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check"); // url is http://localhost:5001/api/auth/check
            set({authUser: res.data});
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signUp: async (formData) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({authUser: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in signup", error);

        } finally {
            set({isSigningUp: false});
        }
    },
}));