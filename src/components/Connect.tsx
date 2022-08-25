import { Box, Button, Text } from "@chakra-ui/react";
import { Mumbai, useEthers } from "@usedapp/core";

const Connect = () => {
  const { account, activateBrowserWallet, switchNetwork, chainId } =
    useEthers();

  const switchToMumbai = async () => {
    if (chainId !== Mumbai.chainId) {
      await switchNetwork(Mumbai.chainId);
      activateBrowserWallet();
    } else {
      activateBrowserWallet();
    }
  };

  return (
    <Box p="5">
      {account && (
        <Text m="2">{account.slice(0, 4) + "..." + account.slice(-2)}</Text>
      )}
      {!account && (
        <Button colorScheme="gray" onClick={switchToMumbai}>
          Connect
        </Button>
      )}
    </Box>
  );
};

export default Connect;
