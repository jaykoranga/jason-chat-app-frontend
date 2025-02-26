import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route, Routes,BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";


function App() {
  return (
    
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </>
      
    
  );
}

export default App;
