import { Box, Heading, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FaHandPaper, FaHandRock, FaHandScissors } from "react-icons/fa";
import {
  GiArmoredPants,
  GiAbdominalArmor,
  GiClosedBarbute,
  GiHeadshot,
  GiHieroglyphLegs,
  GiMuscularTorso,
} from "react-icons/gi";
import { RiCoinFill, RiCoinLine } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { IGame } from "../interfaces/IGame";

const CardTime = ({ game }: { game: IGame }) => {
  const time = game.time2 && game.time2 !== "0" ? game.time2 : game.time1;
  return (
    <Box noOfLines={1}>
      {time && new Date(parseInt(time) * 1000).toLocaleString()}
    </Box>
  );
};

const CardHead = ({ game, status }: { game: IGame; status?: string }) => {
  const { account } = useEthers();
  const [title, setTitle] = useState(<></>);
  const [color, setColor] = useState("");
  const { room } = useParams();

  useEffect(() => {
    if (!game) return;
    if (game.winner === ethers.constants.AddressZero) {
      if (game.player1 === account) {
        setTitle(<Text color="yellow.500">WAIT OPPONENT</Text>);
        setColor("yellow.500");
      } else {
        setTitle(<Text color="blue.500">PLAY GAME</Text>);
      }
    } else {
      if (game.player1 === game.winner) {
        if (game.player1 === account) {
          setTitle(<Text color="green.500">{`YOU WIN ${room}`}</Text>);
        } else if (game.player2 === account) {
          setTitle(<Text color="red.500">{`YOU LOSE ${room}`}</Text>);
        } else {
          setTitle(<Text>{`PLAYER 1 WIN ${room}`}</Text>);
        }
      } else {
        if (game.player2 === account) {
          setTitle(<Text color="green.500">{`YOU WIN ${room}`}</Text>);
        } else if (game.player1 === account) {
          setTitle(<Text color="red.500">{`YOU LOSE ${room}`}</Text>);
        } else {
          setTitle(<Text>{`PLAYER 2 WIN ${room}`}</Text>);
        }
      }
    }
  }, [game]);

  return (
    <Heading size="md" my="3" fontSize={15}>
      {status ? <Text color={color}>{status}</Text> : <Box>{title}</Box>}
    </Heading>
  );
};

const CardPlayer = ({
  game,
  player,
  id,
}: {
  game: IGame;
  player: string;
  id: number;
}) => {
  const { account } = useEthers();

  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!game) return;
    if (player === account) {
      setInfo("YOU");
    } else {
      if (player === ethers.constants.AddressZero) {
        setInfo("WAITING...");
      } else {
        setInfo(player.slice(0, 4) + ".." + player.slice(-3));
      }
    }
  }, [game]);

  return (
    <Text textAlign="left" title={player}>
      Player {id}: {info}
    </Text>
  );
};

const Move = ({ move, player }: { move: string; player?: boolean }) => {
  const moveJsx = [];
  moveJsx.push(
    <GiHeadshot
      fontSize={22}
      color={move !== "0" && move[0] === "2" ? "red" : "gray"}
    />
  );
  moveJsx.push(
    <GiMuscularTorso
      fontSize={22}
      color={move !== "0" && move[1] === "2" ? "red" : "gray"}
    />
  );
  moveJsx.push(
    <GiHieroglyphLegs
      fontSize={22}
      color={move !== "0" && move[2] === "2" ? "red" : "gray"}
    />
  );
  moveJsx.push(<Box>|</Box>);
  moveJsx.push(
    <GiClosedBarbute
      fontSize={22}
      color={move !== "0" && move[3] === "2" ? "teal" : "gray"}
    />
  );
  moveJsx.push(
    <GiAbdominalArmor
      fontSize={22}
      color={move !== "0" && move[4] === "2" ? "teal" : "gray"}
    />
  );
  moveJsx.push(
    <GiArmoredPants
      fontSize={22}
      color={move !== "0" && move[5] === "2" ? "teal" : "gray"}
    />
  );
  if (player) {
    moveJsx.push(<Box>|</Box>);
    moveJsx.push(moveJsx.shift());
    moveJsx.push(moveJsx.shift());
    moveJsx.push(moveJsx.shift());
    moveJsx.shift();
  }
  return (
    <HStack>
      {move === "0" ? (
        <Box>NOT CONFIRMED</Box>
      ) : (
        moveJsx.map((m, i) => <Box key={i}>{m}</Box>)
      )}
    </HStack>
  );
};

const CardFull = ({ game }: { game: IGame }) => {
  const { name, room, id } = useParams();
  const [move1, setMove1] = useState("");

  useEffect(() => {
    const g: any = localStorage.getItem(
      ("game" + name + room + id).toLowerCase()
    );
    if (g) {
      setMove1(JSON.parse(g).move);
    }
  }, [name, room, id]);

  return (
    <VStack width="full" spacing={0}>
      {name && name.toLowerCase() === "HeadsOrTails".toLowerCase() && (
        <VStack width="full" spacing={0}>
          <HStack width="full">
            <Box>Move 1:</Box>
            <Box>
              {game.move1 === "1" || move1 === "1" ? (
                <RiCoinFill fontSize={22} />
              ) : game.move1 === "2" || move1 === "2" ? (
                <RiCoinLine fontSize={22} />
              ) : (
                "NOT CONFIRMED"
              )}
            </Box>
            <Spacer></Spacer>
          </HStack>
          <HStack width="full">
            <Box>Move 2:</Box>
            <Box>
              {game.move2 === "1" ? (
                <RiCoinFill fontSize={22} />
              ) : game.move2 === "2" ? (
                <RiCoinLine fontSize={22} />
              ) : (
                "NOT MOVE"
              )}
            </Box>
            <Spacer></Spacer>
          </HStack>
        </VStack>
      )}
      {name && name.toLowerCase() === "RockPaperScissors".toLowerCase() && (
        <VStack width="full" spacing={0}>
          <HStack width="full">
            <Box>Move 1:</Box>
            <Box>
              {game.move1 === "1" || move1 === "1" ? (
                <FaHandRock fontSize={22} />
              ) : game.move1 === "2" || move1 === "2" ? (
                <FaHandPaper fontSize={22} />
              ) : game.move1 === "3" || move1 === "3" ? (
                <FaHandScissors fontSize={22} />
              ) : (
                "NOT CONFIRMED"
              )}
            </Box>
            <Spacer></Spacer>
          </HStack>
          <HStack width="full">
            <Box>Move 2:</Box>
            <Box>
              {game.move2 === "1" ? (
                <FaHandRock fontSize={22} />
              ) : game.move2 === "2" ? (
                <FaHandPaper fontSize={22} />
              ) : game.move2 === "3" ? (
                <FaHandScissors fontSize={22} />
              ) : (
                "NOT MOVE"
              )}
            </Box>
            <Spacer></Spacer>
          </HStack>
        </VStack>
      )}
      {name && name.toLowerCase() === "AttackAndDefense".toLowerCase() && (
        <VStack width="full" spacing={0}>
          {(move1 || game.move1) !== "0" && (
            <HStack width="full">
              <Box>Move 1:</Box>
              <Move move={move1 || game.move1}></Move>
              <Spacer></Spacer>
            </HStack>
          )}
          {game.move2 !== "0" && (move1 || game.move1) !== "0" && (
            <HStack width="full">
              <Box>Move 2:</Box>
              <Move move={game.move2} player={true}></Move>
              <Spacer></Spacer>
            </HStack>
          )}
        </VStack>
      )}
      {game.move2 !== "0" && (move1 || game.move1) !== "0" && (
        <HStack width="full" title={game.random}>
          <Box>Random:</Box>
          <Box>{game.random.slice(0, 4) + ".." + game.random.slice(-3)}</Box>
          <Spacer></Spacer>
        </HStack>
      )}
    </VStack>
  );
};

const Game = ({ game, status }: { game: IGame; status?: string }) => {
  return (
    <Box>
      {game && (
        <Link to={typeof status === "string" ? "#" : game.id}>
          <Box
            border={1}
            borderColor="gray.100"
            borderRadius="lg"
            borderStyle="dotted"
            textAlign="center"
            p="5"
          >
            <CardTime game={game}></CardTime>
            <CardHead game={game} status={status}></CardHead>
            <CardPlayer game={game} player={game.player1} id={1}></CardPlayer>
            <CardPlayer game={game} player={game.player2} id={2}></CardPlayer>
            {typeof status === "string" && <CardFull game={game}></CardFull>}
          </Box>
        </Link>
      )}
    </Box>
  );
};

export default Game;
