import React, { useEffect, useRef, useState } from 'react'
import { chatState } from '../contexts/chatContext';
import { Box, Text, Button, Flex } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import io from "socket.io-client";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const ChatWindow = () => {
  const { selectedChat, setSelectedChat, user, setDisplayChat, displayChat } =
    chatState();
  const [newMessage, setNewMessage] = useState("");
  const [input, setInput] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const toast = useToast();

   const [socket,setSocket]=useState(null)
    const ENDPOINT = `${API_URL}`;
    var  selectedChatCompare;
    useEffect(() => {
      
      setSocket(io(ENDPOINT))
      if(user){
        if(socket){
            socket.emit("setup", user);
            socket.on("connected", () => setSocketConnection(true));
  
        }
       
      }
      
    }, [user]);
    
    useEffect(()=>{
      if(socket){
        socket.on("message recieved", (newMessage) => {
          if (
            !selectedChatCompare ||
            selectedChatCompare._id !== newMessage.chat._id
          ) {
            //do nothing
          } else {
            setAllMessages(()=>[...allMessages, newMessage]);
          }
        });
      }
      
    })

  //handling input from the bottom of the chat window
  const handleInput = (e) => {
    setInput(e.target.value);
  };

  // handle the submit of the input message
  const handleSubmit = () => {
    if (input.trim() != "") {
      sendMessage(input);
      setInput("")
    }
  };
  //sending a message to backend
  const sendMessage = async (message) => {
    if (message !== "") {
      try {
        const response = await fetch(`${API_URL}/api/messages`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.jwt}`,
          },
          body: JSON.stringify({
            content: message,
            chat_id: selectedChat._id,
          }),
        });
        const data = await response.json();
         socket.emit("new message", data);
        
        setAllMessages((prev) => [...prev, data]);

        console.log(`sending the message :${data}`);
        setInput("");
      } catch (error) {
        toast({
          title: "Error!",
          description: "Message not been able to send. Please try again.",
          status: "error",
          duration: 3000, // 3 seconds
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  //retreiving all the chat messages for the display
  const getAllMessages = async () => {
    if (selectedChat) {
      try {
        const response = await fetch(
          `${API_URL}/api/messages/${selectedChat._id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${user.jwt}`,
            },
          }
        );
        const data = await response.json();

        setAllMessages([])
        setAllMessages(data);
         if (selectedChat) socket.emit("join-room", selectedChat._id);
        // console.log(`the first message of messages is : ${allMessages[0].content}`);
      } catch (error) {
        toast({
          title: "Error!",
          description:
            "not able to retrieve all the messages. Please try again.",
          status: "error",
          duration: 3000, // 3 seconds
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key == "Enter" && input.trim() != "") {
      handleSubmit();
    }
  };
   const messageEndRef = useRef(null);
  //scroll to the bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //using useEffect hook to retireve alll the messages at first
  useEffect(() => {
    getAllMessages();
    selectedChatCompare=selectedChat;
    
  }, [selectedChat]);
  useEffect(()=>{
    scrollToBottom();
  },[allMessages])

  return (
    <>
      {!displayChat && (
        <div className={`chat-window ${""}`}>
          <h2>One-on-One Chat</h2>
          <p>Select a chat to start messaging...</p>
        </div>
      )}
      {displayChat && (
        <div className={`chat-window ${""}`}>
          <h1>
            {selectedChat
              ? selectedChat.users[0]._id === user._id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name
              : "loading the name"}
          </h1>
          <div className="main-chat-window">
            <div className="message-container">
              {allMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-${
                    msg.sender._id == user._id ? `sent` : "recieve"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <button onClick={handleSubmit}>send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWindow
