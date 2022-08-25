import { Box, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { Call, useCalls } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { games } from "../queries";
import parseGames from "../utils/parseGames";
import Game from "../components/Game";
import { IGame } from "../interfaces/IGame";

export default () => {
  const { name, room, id = "" } = useParams();
  const { pathname } = useLocation();

  let [query, setQuery] = useState<Call[]>([]);

  useEffect(() => {
    if (name && room) setQuery(games(name, room, 10, 0, true));
  }, [name, room]);

  const gamesRaw: any = useCalls(query) ?? [];
  const gamesList: IGame[] = parseGames(gamesRaw);

  const showGames = !(pathname.indexOf("/move") + 1) && !id;

  return (
    <VStack>
      <Outlet></Outlet>

      {showGames && (
        <VStack>
          <Box m="10">
            <Link to="move">
              <Button size="lg">NEW GAME</Button>
            </Link>
          </Box>
          <SimpleGrid columns={{ sm: 2, lg: 3 }} spacing={5}>
            {gamesList &&
              !!gamesList.length &&
              gamesList.map((game: any) => (
                <Game key={game.id} game={game}></Game>
              ))}
          </SimpleGrid>
        </VStack>
      )}
    </VStack>
  );
};
