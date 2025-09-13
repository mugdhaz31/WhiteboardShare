import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import { toast } from "react-toastify";

const Chat = ({ user, roomCode }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const messagesEndRef = useRef(null);
  const showChatRef = useRef(showChat);

  useEffect(() => {
    showChatRef.current = showChat;
  }, [showChat]);

  // useEffect(() => {
  //   // ✅ Define handler functions here to ensure unique references for each component
  //   const handleReceiveMessage = (msg) => {
  //     const parsedMsg = {
  //       ...msg,
  //       timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
  //     };
  //     setMessages((prev) => [...prev, parsedMsg]);
  //   };

  //   const handleNewMessageNotification = ({ sender }) => {
  //     if (!showChatRef.current && sender.name !== user.name) {
  //       toast.info(`New message from ${sender.name}`, {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       });
  //     }
  //   };

  //   // ✅ Register listeners for this instance
  //   socket.on("receiveChatMessage", handleReceiveMessage);
  //   socket.on("newMessageNotification", handleNewMessageNotification);

  //   // ✅ Cleanup listeners on unmount
  //   return () => {
  //     socket.off("receiveChatMessage", handleReceiveMessage);
  //     socket.off("newMessageNotification", handleNewMessageNotification);
  //   };
  // }, [user.name]); // ✅ depend on user.name if it may change
  useEffect(() => {
  const handleReceiveMessage = (msg) => {
    console.log("Received message:", msg);
    const parsedMsg = {
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    };
    setMessages((prev) => [...prev, parsedMsg]);

    if (!showChatRef.current && msg.user.name !== user.name) {
      toast.info(`New message from ${msg.user.name}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  socket.on("receiveChatMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveChatMessage", handleReceiveMessage);
  };
}, [user.name]);


  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      user: { name: user.name },
      message: newMessage,
      timestamp: new Date().toISOString(),
      roomCode,
    };

    socket.emit("sendChatMessage", messageData);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed left-4 bottom-4 bg-black text-white px-4 py-2 rounded-xl shadow-md z-50 hover:bg-gray-800 transition duration-200"
        >
          Chat
        </button>
      )}

      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl border-r border-gray-300 flex flex-col z-40 transition-transform ${showChat ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h3 className="font-semibold text-black">Chat</h3>
          <button className="text-gray-600 hover:text-black" onClick={() => setShowChat(false)}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.user.name === user.name ? "items-end" : "items-start"}`}>
              <div className={`px-3 py-1 rounded-lg max-w-xs break-words ${msg.user.name === user.name ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
                {msg.message}
              </div>
              <span className="text-xs text-gray-500 mt-1">{msg.user.name} • {msg.timestamp.toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-300 bg-gray-100 flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
