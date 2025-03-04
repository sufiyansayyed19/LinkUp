import {useState} from 'react';
import { useRef } from 'react';
import { useChatStore } from '../store/useChatStrore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] =useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage ,setIsMessageImage} = useChatStore();

    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image")) { 
            toast.error("No file selected");
            return;
        } 
        setIsMessageImage(true);
        const reader = new FileReader(); // creates instance of FileReader
        reader.readAsDataURL(file); // reads the file and convertes it to base64
        reader.onload = () => setImagePreview(reader.result); // sets the base64 result to imagePreview
    };

    const handleSendMessage = async(e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // reset the form after sending the message
            setText("");
            setImagePreview(null);
            removeImage();
        } catch (error) {
            console.log("Error in handleSendMessage", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    

    return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
        
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg h-10 sm:h-12"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`w-10 h-10 sm:w-12 sm:h-12 btn btn-circle 
              ${imagePreview ? "text-emerald-500" : "text-zinc-400"} text-base`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};


export default MessageInput;