import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

export default () => {
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, []);
};
