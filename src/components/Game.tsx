import { Box, Heading, LinkBox, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Game = ({ game }: { game: any }) => {
  return (
    <Box bg="tomato">
      {game && (
        <Box>
          <Box>
            {game.time1 && new Date(parseInt(game.time1) * 1000).toISOString()}
          </Box>
          <Heading size="md" my="2">
            <Link to={game.id}>{game.winner}</Link>
          </Heading>
          <Text>Player1: {game.player1}</Text>
          <Text>Player2: {game.player2}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Game;
