import React, { useEffect, useState } from "react";
import { chatState } from "../contexts/chatContext";
import { useNavigate } from "react-router-dom";
import "../styles/chatPage.css";
import ChatSidebar from "../miscelleneous/ChatSidebar";
const API_URL = import.meta.env.VITE_BACKEND_URL;
import { Avatar } from "@chakra-ui/react";
import ChatWindow from "../miscelleneous/ChatWindow";
import io from "socket.io-client";

const ChatPage = () => {
  const {
    user,
    setUser,
    logout,
    setLogout,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = chatState();
  
  const navigate = useNavigate();
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [loading,setLoading]=useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      console.log("User found in localStorage:", storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.log("User not found, redirecting to login...");
      navigate("/");
    }
  }, []);

  const handleLogout = () => {
    
    setUser(null);
    setLogout(true);
    localStorage.removeItem("userInfo");
    navigate("/", { replace: true });
  
  };
  
   const fetchChats = async () => {
     if (!user || !user.jwt || logout === true) {
       return;
     }
     console.log(user);

     try {
       const response = await fetch(`${API_URL}/api/chats`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${user.jwt}`,
         },
       });

       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }

       const data = await response.json();
       setChats(data);
       setLoading(false);
     } catch (error) {
       console.error("Error fetching chats:", error.message);
     }
   };

  useEffect(() => {
    
    console.log(`user in usestate ${user}`)
    if(user){
      
      fetchChats();
      
    }
  },[user]);
  
    if (!user) {
      return <div>Loading user...</div>;
    }

  if (loading) {
    return <div>Loading chat data...</div>;
  }
  const openProfile = () => {
    setIsOpenProfile(true);
  };
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Jason Chat App</h1>
        <h1>{user ? user.name : "user is coming"}</h1>
        <div className="chat-header-buttons">
          <Avatar
            name=""
            src=""
            shape="rounded"
            size="sm"
            onClick={openProfile}
          />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="chat-main">
        <ChatSidebar
          chats={chats}
          setChats={setChats}
          user={user}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />

        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
