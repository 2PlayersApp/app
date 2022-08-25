import { extendTheme } from "@chakra-ui/react";
import bg from "../assets/bg.png";

export default extendTheme({
  useSystemColorMode: false,
  initialColorMode: "dark",
  fonts: {
    heading: `'Major Mono Display', sans-serif`,
    body: `'Major Mono Display', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "black",
      },
      "html,body": {
        height: "100%",
        width: "100%",
      },
      ".bg": {
        margin: 0,
        padding: 0,
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundImage: "url(" + bg + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        WebkitBackgroundSize: "cover",
        MozBackgroundSize: "cover",
        OBackgroundSize: "cover",
      },
    },
  },
});
