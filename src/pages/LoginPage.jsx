import React from "react";
import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const MotionFlex = motion(Flex);

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // ✅ 登入成功後導向 Dashboard
    } catch (error) {
      console.error("登入失敗", error);
    }
  };

  return (
    <MotionFlex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="teal.500"
      color="white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <VStack spacing={6}>
        <Heading size="2xl" textAlign="center">
          我的習慣追蹤器 🌱
        </Heading>
        <Text fontSize="lg" textAlign="center">
          記錄、養成並堅持你的好習慣！
        </Text>
        <Button colorScheme="whiteAlpha" size="lg" onClick={handleLogin}>
          使用 Google 登入
        </Button>
      </VStack>
    </MotionFlex>
  );
};

export default LoginPage;
