import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isMessageImage: false,

    
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
            // console.log("res.data", res.data);
            set({messages: res.data});
        } catch (error) {
            console.log("Error in getMessages", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isMessageLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages = []} = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log("Error in sendMessage", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },


// to do: optimize for real-time updates

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageFromSelectedUser) return;
            set((state) => ({messages: [...state.messages, newMessage]}));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({selectedUser: user}),

    setIsMessageImage: (value) => set({isMessageImage: value}),
}));


