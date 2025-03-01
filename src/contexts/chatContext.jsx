import { useContext, useEffect, useState } from "react";
import {createContext} from "react"


const chatContext=createContext();

const ChatProvider=({children})=>{ 
  const [user, setUser] = useState(null);
  const [logout, setLogout] = useState(false);
  const [selectedChat,setSelectedChat]=useState(null);
  const [chats,setChats]=useState([]);
  const [displayChat,setDisplayChat]=useState(false);
    
     
     useEffect(()=>{
       const userInfo=JSON.parse(localStorage.getItem("userInfo"))
       if(userInfo) setUser(userInfo);
     },[]);

     return (
       <chatContext.Provider
         value={{
           user,
           setUser,
           logout,
           setLogout,
           selectedChat,
           setSelectedChat,
           chats,
           setChats,
           displayChat,
           setDisplayChat,
         }}
       >
         {children}
       </chatContext.Provider>
     );
     
    }
    export const chatState=()=>{
         return useContext(chatContext)
   }
export default ChatProvider;