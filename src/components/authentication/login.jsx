
import React, { useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { chatState } from '../../contexts/chatContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const{setLogout}=chatState();

  const handleLogin = async(e) => {
    e.preventDefault();
    // Add login logic here
    setLoading(true);
    if(!email || !password){
      toast({
        title: "enter the email or password or both ,you dumb ass",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
      const info={
        email,password
      }
       try {
         const response = await fetch(
           `${API_URL}/api/users/login/`,
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(info),
           }
         );

         if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || "log in  failed!");
         }

         const data = await response.json();

         toast({
           title: "log in successfully!",
           status: "success",
           duration: 3000,
           isClosable: true,
           position: "bottom",
         });

         localStorage.setItem("userInfo", JSON.stringify(data));
         setLoading(false);
         
         console.log(localStorage.getItem("userInfo"));
         setLogout(false);
          navigate("/chat", { replace: true });
       } catch (error) {
         toast({
           title: "log-in failed!",
           description:
             error.response?.data?.message ||
             "Something went wrong. Please try again.",
           status: "error",
           duration: 3000,
           isClosable: true,
           position: "bottom",
         });
         setLoading(false);
       }
      
    
   
  };

  return (
    <Box bg="blackAlpha.400" p={6} borderRadius="md" boxShadow="md" w="100%">
      <form onSubmit={handleLogin}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={useColorModeValue("white", "whiteAlpha.100")}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg={useColorModeValue("white", "whiteAlpha.100")}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            type="submit"
            size="lg"
            w="100%"
            isLoading={loading}
            loadingText="logging in"
          >
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
