import { VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Build from "./Build";
import Header from "./Header";
import Menu from "./Menu";
import Move1 from "./Move1";
import Move2 from "./Move2";
import Room from "./Room";

const Play = () => {
  return (
    <VStack minW="full">
      <Header />
      <VStack minW="full">
        <Routes>
          <Route path="/" element={<Menu />}>
            <Route path=":name/:room" element={<Room />}>
              <Route path="move" element={<Move1 />} />
              <Route path=":id" element={<Move2 />} />
            </Route>
            <Route path="build" element={<Build />} />
          </Route>
        </Routes>
      </VStack>
    </VStack>
  );
};

export default Play;
