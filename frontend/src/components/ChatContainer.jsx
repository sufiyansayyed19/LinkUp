import { useEffect } from "react";
import { useChatStore } from "../store/useChatStrore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const {messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();

    useEffect(() => {
        getMessages(selectedUser?._id); // Fetches messages for the selected user.
        subscribeToMessages(); // Subscribes to WebSocket for real-time updates.
    
        return () => {
            unsubscribeFromMessages(); // Cleans up WebSocket subscription when the component unmounts or re-runs.
        };
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton/>
                <MessageInput />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                <div
                    key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                    // ref={messageEndRef}
                >
                    <div className=" chat-image avatar">
                    <div className="size-10 rounded-full border">
                    <img
                    src={
                        message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    />
                </div>
                </div>
                <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                        {formatMessageTime(message.createdAt)}
                    </time>
                </div>
                <div className="chat-bubble flex flex-col">
                    {message.image && (
                        <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                        />
                    )}
                    {message.text && <p>{message.text}</p>}
                </div>
            </div>
            ))}
      </div>

            <MessageInput />
        </div>)
};

export default ChatContainer;