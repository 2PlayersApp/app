import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { Config, DAppProvider, Mumbai } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import { MULTICALL } from "./constants";
import App from "./App";
import bg from "./assets/bg.png";
import "@fontsource/major-mono-display/400.css";

const theme = extendTheme({
  useSystemColorMode: false,
  initialColorMode: "dark",
  fonts: {
    heading: `'Major Mono Display', sans-serif`,
    body: `'Major Mono Display', sans-serif`,
  },
  styles: {
    global: {
      "html,body": {
        height: "100%",
        width: "100%",
      },
      ".bg": {
        margin: 0,
        padding: 0,
        position: "absolute",
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

const config: Config = {
  readOnlyChainId: Mumbai.chainId,
  readOnlyUrls: {
    [Mumbai.chainId]:
      "https://polygon-mumbai.g.alchemy.com/v2/k5Xr7DanRifL-_q2Hmu7D8t1Mfl-frpA",
  },
  multicallAddresses: {
    [Mumbai.chainId]: MULTICALL,
  },
  noMetamaskDeactivate: true,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DAppProvider config={config}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <div className="bg"></div>
          <App />
        </ChakraProvider>
      </DAppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
