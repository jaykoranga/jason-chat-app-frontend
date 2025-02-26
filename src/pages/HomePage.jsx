import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  Stack,
  Heading,
} from "@chakra-ui/react";
import Login from "../components/authentication/login";
import SignUp from "../components/authentication/signup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate=useNavigate()
  // useEffect(()=>{
  //   const userInfo=JSON.parse(localStorage.getItem("userInfo"))
  //   if(userInfo){
  //     navigate("/chats")
  //   }
  // },[])
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  return (
    <Container maxW="lg" centerContent py={8}>
      {/* Header Section */}
      <Box
        bg="teal.500"
        w="100%"
        p={6}
        mb={6}
        textAlign="center"
        borderRadius="md"
        color="white"
        boxShadow="md"
      >
        <Heading fontSize="3xl">Jason-Chat-App</Heading>
        <Text mt={2}>Connect with kaido and his friends</Text>
      </Box>

      {/* Registration/Login Section */}
      <Box bg="grey.500" p={6} borderRadius="md" w="100%" boxShadow="md">
        <VStack spacing={4} align="stretch">
          {isLogin ? <Login /> : <SignUp />}

          <Button
            colorScheme="teal"
            size="md" // Smaller size
            variant="link" // Link variant for a subtle look
            onClick={toggleForm}
            alignSelf="center" // Center the button
            fontSize="sm" // Smaller font size
          >
            {isLogin ? "/Sign Up" : "/Login"}
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default HomePage;
