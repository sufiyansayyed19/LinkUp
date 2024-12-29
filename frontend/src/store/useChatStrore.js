import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";


export const useChatStore = create((set) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    getUsers: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error) {
            console.log("Error in getUsers", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isUserLoading: false});
        }
    },
    getMessages: async (userId) => {
        set({isMessageLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            console.log("Error in getMessages", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isMessageLoading: false});
        }
    },
}));


