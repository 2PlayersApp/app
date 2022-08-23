import { Box, Button, Heading, LinkBox, Text } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Link } from "react-router-dom";

const Game = ({ game }: { game: any }) => {
  const { account } = useEthers();

  return (
    <Box>
      {game && (
        <Box
          border={1}
          borderColor="gray.100"
          borderRadius="lg"
          borderStyle="dotted"
          p="8"
          textAlign="center"
        >
          <Box noOfLines={1}>
            {game.time1 &&
              new Date(parseInt(game.time1) * 1000).toLocaleString()}
          </Box>
          <Heading size="md" my="2">
            {game.winner !== "0x0000000000000000000000000000000000000000" ? (
              <Link to={game.id}>
                WINNER: {game.winner === game.player1 ? "PLAYER 1" : "PLAYER 2"}
              </Link>
            ) : (
              <Text>
                {game.player1 === account ? (
                  <Link to={game.id}>WAIT OPPONENT</Link>
                ) : (
                  <Link to={game.id}>
                    <Text color="green.400">TAKE THE GAME!</Text>
                  </Link>
                )}
              </Text>
            )}
          </Heading>
          <Text textAlign="left">
            Player 1:{" "}
            {game.player1 === account ? (
              game.winner === game.player1 ? (
                <Text as="span" color="green.300">
                  YOU
                </Text>
              ) : game.winner !==
                  "0x0000000000000000000000000000000000000000" &&
                game.winner === game.player2 ? (
                <Text as="span" color="red.300">
                  YOU
                </Text>
              ) : (
                "YOU"
              )
            ) : game.player1 ===
              "0x0000000000000000000000000000000000000000" ? (
              "Waiting..."
            ) : (
              game.player1.slice(0, 4) + "..." + game.player1.slice(-3)
            )}
          </Text>
          <Text textAlign="left">
            Player 2:{" "}
            {game.player2 === account ? (
              game.winner === game.player2 ? (
                <Text as="span" color="green.300">
                  YOU
                </Text>
              ) : game.winner !==
                  "0x0000000000000000000000000000000000000000" &&
                game.winner === game.player1 ? (
                <Text as="span" color="red.300">
                  YOU
                </Text>
              ) : (
                "YOU"
              )
            ) : game.player2 ===
              "0x0000000000000000000000000000000000000000" ? (
              "Waiting..."
            ) : (
              game.player2.slice(0, 4) + "..." + game.player2.slice(-3)
            )}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Game;
