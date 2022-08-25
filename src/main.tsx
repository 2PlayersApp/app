import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import { HashRouter } from "react-router-dom";
import { usedapp, chakra } from "./providers";
import App from "./App";
import "@fontsource/bungee/400.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <DAppProvider config={usedapp}>
        <ChakraProvider theme={chakra}>
          <div className="bg"></div>
          <App />
        </ChakraProvider>
      </DAppProvider>
    </HashRouter>
  </React.StrictMode>
);
