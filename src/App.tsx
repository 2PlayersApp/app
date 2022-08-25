import { Container } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import Index from "./components/Index";
import Play from "./components/Play";

import dark from "./utils/dark";

function App() {
  const { pathname } = useLocation();
  dark();
  return (
    <Container minW="full" centerContent>
      {pathname === "/" && <Index />}
      {pathname !== "/" && <Play />}
    </Container>
  );
}

export default App;
