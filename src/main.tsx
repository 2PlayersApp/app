import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Config, DAppProvider, Goerli } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import { MULTICALL } from "./constants";
import App from "./App";

const configChakra = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const theme = extendTheme(configChakra);

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
