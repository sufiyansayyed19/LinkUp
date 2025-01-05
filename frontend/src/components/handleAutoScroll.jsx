
export  const handleAutoScroll = (isMessageImage, messageEndRef) => {
    if (!messageEndRef.current) return;
    
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!isMessageImage) {
        scrollToBottom();
    } else {
        // Delay scrolling to ensure images are fully loaded
        return setTimeout(scrollToBottom, 1000);
    }
};