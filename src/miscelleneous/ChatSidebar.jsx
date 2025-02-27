import { Button, HStack, VStack } from "@chakra-ui/react";

import React, { useState } from "react";
import { chatState } from "../contexts/chatContext";
const API_URL = import.meta.env.VITE_BACKEND_URL;

import { useEffect } from "react";
const ChatSidebar = ({ chats, setchats,user,selectedChat,setSelectedChat }) => {
  const {displayChat,setDisplayChat}=chatState()
  const [isSearchMenueOpen, setIsSearchMenueOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loggedUser,setLoggedUser]=useState();
 
 
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSearchMenueOpen(true);
    if (e.target.value === "") {
      setIsSearchMenueOpen(false);
      setSearchResults([]);
    }
  };
    
  const handleGoClick=(async()=>{
    if(!searchInput.trim()) return;
    try {
      const response=await fetch(`${API_URL}/api/users/getAllUsers?name=${searchInput}`,{
        method:"GET",
        headers:{
          "content-type":"application/json",
          "Authorization":`Bearer ${user.jwt}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data=await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(`error getting the users : ${error.message}`)
    }
  })

  // selecting a chat 
  const accessChat=(async (userId)=>{
        try {
          const response = await fetch(`${API_URL}/api/chats`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${user.jwt}`,
            },
            body: JSON.stringify({ userId }),
          });
          const data=await response.json()
          setSelectedChat(data);
          setDisplayChat(true);
         
         
          
            // console.log(
            // `the selected chat is of  ${
            //   selectedChat.users[0]._id === user._id
            //     ? selectedChat.users[1].name
            //     : selectedChat.users[0].name
            // }`
          // );
        } catch (error) {
          
          throw new Error(error.message)
        }
        
  })


  const handleAccessChat=(userId)=>{
         accessChat(userId);
          setIsSearchMenueOpen(false);
          setSearchInput("");
  }
  const handleCreateGroup=()=>{
    
  }

  return (
    <>
      <div className="chat-sidebar">
        <div className="chat-search-bar">
          <input
            type="text"
            placeholder="Search a User...."
            className="chat-search-bar"
            value={searchInput}
            onChange={handleSearch}
          />
        </div>

        {isSearchMenueOpen && (
          <div className="chat-item">
            <HStack justifyContent="space-between">
              <Button
                className="go-button"
                colorScheme="Green"
                onClick={handleGoClick}
              >
                Go
              </Button>
              <Button
                colorScheme="red"
                size="xs"
                className="close-button"
                onClick={() => {
                  setIsSearchMenueOpen(false);
                  setSearchInput("");
                }}
              >
                X
              </Button>
            </HStack>
            <VStack alignItems="flex-start" spacing={4} p={4}>
              <h1>search results</h1>

              <div className="users-list">
                {searchResults.map((searchResult, index) => (
                  <div
                    key={index}
                    className="users-items"
                    onClick={() => handleAccessChat(searchResult._id)}
                  >
                    {`${searchResult.name}(${searchResult.email})` ||
                      `user ${index + 1}`}
                  </div>
                ))}
              </div>
            </VStack>
          </div>
        )}
        {!isSearchMenueOpen && (
          <div className="chat-list">
            <Button size="lg" onClick={handleCreateGroup}>
              {" "}
              + create a group
            </Button>
            {chats.map((chat, index) => (
              <div
                key={index}
                className="chat-item"
                onClick={() => handleAccessChat(chat.users[0]._id==user._id?chat.users[1]:chat.users[0])}
              >
                {`${
                  chat.users[0]._id === user._id
                    ? chat.users[1].name
                    : chat.users[0].name
                }(${
                  chat.users[0]._id === user._id
                    ? chat.users[1].email
                    : chat.users[0].email
                })` || `Chat ${index + 1}`
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatSidebar;
