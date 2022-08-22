import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Config, DAppProvider, Localhost, Goerli } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import { MULTICALL } from "./constants";
import App from "./App";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]:
      "https://eth-goerli.g.alchemy.com/v2/QcMKzo98P15jLRjZos_eeGZblnaB_ZgD",
  },
  multicallAddresses: {
    [Goerli.chainId]: MULTICALL,
  },
  noMetamaskDeactivate: true,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <DAppProvider config={config}>
          <App />
        </DAppProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
