import { Box, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Connect from "./Connect";

const Header = () => {
  return (
    <HStack minW="full">
      <Box>
        <Heading size="md" color="white">
          <Link to="/">2Players.App</Link>
          <Text as="small" fontSize="xs">
            {" "}
            [ mumbai testnet ]
          </Text>
        </Heading>
      </Box>
      <Spacer />
      <Connect />
    </HStack>
  );
};

export default Header;
