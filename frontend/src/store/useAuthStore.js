import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const baseURL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile : false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check"); // url is http://localhost:5173/api/auth/check
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },
    
    signup: async (formData) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({authUser: res.data});
            toast.success("Signed up successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in signup", error);

        } finally {
            set({isSigningUp: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({
                authUser: null,
                isSigningUp: false,
                isLogingIn: false,
                isUpdatingProfile: false,
            });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logout", error);
            toast.error(error.response?.data?.message || "Error logging out");
        }
    },

    login: async (formData) =>{
        set({isLogingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({authUser: res.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in login", error);
        } finally {
            set({isLogingIn: false});
        }
    },

    updateProfile: async (profilePicture) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", profilePicture);
            console.log("useAuthStore updateProfile", res.data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in updateProfile", error);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(baseURL,{
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({socket: socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });
    },

    disconnectSocket: () => {
       if (get().socket?.connected) {get().socket.disconnect();}
    },

}));