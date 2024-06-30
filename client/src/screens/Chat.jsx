

import React, { useState, useEffect, useRef } from "react";
import { GrFormAttachment } from "react-icons/gr";

const ChatBox = ({ socket, remoteSocketId, userName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);

  const handleMessageSend = () => {
    if (message.trim()) {
      const fullMessage = `${userName}: ${message}`;
      socket.emit("send:message", { to: remoteSocketId, message: fullMessage });
      setMessages([...messages, { sender: "me", text: fullMessage }]);
      setMessage("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const fileMessage = {
          fileName: file.name,
          fileType: file.type,
          fileContent,
          sender: "me",
        };
        socket.emit("send:file", { to: remoteSocketId, fileMessage });
        setMessages([...messages, fileMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    socket.on("receive:message", ({ from, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "remote", text: message },
      ]);
    });

    socket.on("receive:file", ({ from, fileMessage }) => {
      setMessages((prevMessages) => [...prevMessages, { ...fileMessage, sender: "remote" }]);
    });

    return () => {
      socket.off("receive:message");
      socket.off("receive:file");
    };
  }, [socket, setMessages]);

  const renderMessageContent = (message) => {
    if (message.fileContent) {
      if (message.fileType.startsWith("image/")) {
        return <img src={message.fileContent} alt={message.fileName} className="max-w-full h-auto inline-block" />;
      } else if (message.fileType.startsWith("video/")) {
        return <video src={message.fileContent} controls className="max-w-full h-auto inline-block"></video>;
      } else if (message.fileType.startsWith("audio/")) {
        return <audio src={message.fileContent} controls className="max-w-full h-auto inline-block"></audio>;
      }
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.text ? message.text.split(urlRegex) : [];

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        if (/\.(jpeg|jpg|gif|png)$/.test(part)) {
          return <img key={index} src={part} alt="" className="max-w-full h-auto inline-block" />;
        } else {
          return (
            <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {part}
            </a>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="absolute right-0 top-0 w-[282px] h-full bg-white border-l border-black z-50 ">
      <div className="h-[93vh] overflow-y-scroll p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex my-1 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.sender === "me" ? "bg-green-500" : "bg-red-500"
              } text-white p-2 rounded break-all inline-block`}
            >
              <span>
                {renderMessageContent(msg)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 flex">
        <GrFormAttachment onClick={handleAttachmentClick} className=" cursor-pointer text-4xl" />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          className="w-4/5 border border-gray-300 rounded p-1 mr-2"
        />
        <button
          onClick={handleMessageSend}
          className="w-1/5 bg-blue-500 text-white rounded p-1 hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
