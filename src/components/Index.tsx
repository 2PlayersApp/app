import { Heading, Spacer, VStack, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <VStack minW="full" minH="full" position="absolute">
      <Spacer />
      <Heading>2Players.App</Heading>
      <Text>WEB3 Platform For Build Decentralized Games</Text>
      <Link to="HeadsOrTails/1MATIC">
        <Button m="10" p="5">
          Launch App
        </Button>
      </Link>
      <Spacer />
    </VStack>
  );
};

export default Index;
