import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from 'axios';
const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pic, setPic] = useState(null); // For Profile Picture Upload
  const [loading, setLoading] = useState(false); // For Button Loading State
  const [imageURL, setImageURL] = useState(null); // To store uploaded image URL
  const toast = useToast();
  const navigate = useNavigate();

  const postFile = async (pics) => {
    if (!pics) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Only JPEG and PNG files are allowed!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true); // Start loading

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat-app-jason");
    data.append("cloud_name", "dlvzehbcf");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlvzehbcf/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const fileData = await response.json();
      setPic(fileData.url.toString())
      setImageURL(fileData.secure_url); // Store the URL
      console.log(fileData)
      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Image upload failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(!name || !email || !password || !confirmPassword ){
       toast({
         title: "please fill all the feilds!",
         status: "warning",
         duration: 4000,
         isClosable: true,
         position: "bottom", 
       });
       setLoading(false);
       return ;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    

    setLoading(true); // Start loading
     
    // Simulate an API call for sign-up
    const info={
      name,
      email,
      password,
      pic
    }
   
    try {
      const response = await fetch(`${API_URL}/api/users/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed!");
      }

      const data = await response.json();

      toast({
        title: "Signed up successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat", { replace: true });

    }
    catch (error) {
       toast({
         title: "Sign-up failed!",
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
      <form onSubmit={handleSignUp}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              bg={useColorModeValue("white", "whiteAlpha.100")}
            />
          </FormControl>

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
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={useColorModeValue("white", "whiteAlpha.100")}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="link"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              bg={useColorModeValue("white", "whiteAlpha.100")}
            />
          </FormControl>

          <FormControl id="profile-pic">
            <FormLabel>Upload Profile Picture</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => postFile(e.target.files[0])}
              bg={useColorModeValue("white", "whiteAlpha.100")}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            size="lg"
            w="100%"
            isLoading={loading}
            loadingText="Signing Up"
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignUp;
