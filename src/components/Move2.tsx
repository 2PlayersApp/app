import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  HStack,
  IconButton,
  Kbd,
  keyframes,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Call, useCalls, useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { RiCoinFill, RiCoinLine } from "react-icons/ri";
import { write, game, winner } from "../queries";

import parseGame from "../utils/parseGame";
import parseWinner from "../utils/parseWinner";
import parseChain from "../utils/parseChain";
import { IGame } from "../interfaces/IGame";
import Game from "./Game";
import { FaHandPaper, FaHandRock, FaHandScissors } from "react-icons/fa";
import {
  GiArmoredPants,
  GiAbdominalArmor,
  GiClosedBarbute,
  GiHeadshot,
  GiHieroglyphLegs,
  GiMuscularTorso,
} from "react-icons/gi";

const animationKeyframes = keyframes`
  0% { transform: scale(1) }
  50% { transform: scale(1.1) }
  100% { transform: scale(1) }
`;

const animation = `${animationKeyframes} 1s ease-in-out infinite`;

const p = {
  name: "",
  room: "",
  id: "",
  move: "0",
  phrase: "",
  proof: "0x0000000000000000000000000000000000000000000000000000000000000000",
  cipher: "0x0000000000000000000000000000000000000000000000000000000000000000",
};

const Move2 = () => {
  const { account } = useEthers();
  const { pathname } = useLocation();
  const { name, room, id = "1" } = useParams();

  const [clickHeads, setClickHeads] = useState(false);
  const [clickTails, setClickTails] = useState(false);

  const [clickRock, setClickRock] = useState(false);
  const [clickPaper, setClickPaper] = useState(false);
  const [clickScissors, setClickScissors] = useState(false);

  const [clickAttackHead, setClickAttackHead] = useState("");
  const [clickAttackBody, setClickAttackBody] = useState("");
  const [clickAttackLegs, setClickAttackLegs] = useState("");
  const [clickDefenseHead, setClickDefenseHead] = useState("");
  const [clickDefenseBody, setClickDefenseBody] = useState("");
  const [clickDefenseLegs, setClickDefenseLegs] = useState("");

  const [loading, setLoading] = useState(false);

  let [query, setQuery] = useState<Call[]>([]);
  let [queryWin, setQueryWin] = useState<Call[]>([]);

  const [player, setPlayer] = useState(p);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (name && room && id) {
      setQuery(game(name, room, id));
    }
    if (name && room && id) {
      setQueryWin(winner(name, room, id, player.move, player.proof));
    }
    const s = localStorage.getItem(("game" + name + room + id).toLowerCase());
    if (s) setPlayer(JSON.parse(s));
  }, [name, room, id]);

  const gameRaw: any = useCalls(query) ?? [];
  const gameItem: IGame = parseGame(gameRaw);

  const winnerRaw = useCalls(queryWin) ?? [];
  const witterItem: { winner: string; sec: string } = parseWinner(winnerRaw);

  useEffect(() => {
    if (!account || account === ethers.constants.AddressZero) return;

    if (gameItem && gameItem.winner !== ethers.constants.AddressZero) {
      if (gameItem.winner === account) {
        setStatus("You Winner");
      }
    }
    if (gameItem.player1 === account) {
      if (gameItem.winner !== ethers.constants.AddressZero) {
        if (gameItem.winner === account) {
          setStatus("Yeah! Play againe.");
        } else if (gameItem.winner === gameItem.player2) {
          setStatus("Hmmm! Game Over.");
        }
      } else {
        if (gameItem.player2 === ethers.constants.AddressZero) {
          setStatus("Wait 2 player");
        } else {
          if (gameItem.time2 === "0") {
            setStatus("Wait Random");
          } else {
            setStatus("Wait Result");
            if (witterItem.sec === "0") {
              if (witterItem.winner === account) {
                setStatus("Time Over");
              }
            } else {
              setStatus("Claim And Confirm [ " + witterItem.sec + " sec ]");
            }
          }
        }
      }
    } else if (gameItem.player2 === account) {
      if (gameItem.winner !== ethers.constants.AddressZero) {
        if (gameItem.winner === account) {
          setStatus("Yeah! Play againe.");
        } else if (gameItem.winner === gameItem.player1) {
          setStatus("Hmmm! Game Over.");
        }
      } else {
        if (gameItem.time2 === "0") {
          setStatus("Wait Random");
        } else {
          setStatus("Wait Result");
          if (witterItem.winner === account) {
            setStatus("Player 1 Not Confirmed");
          } else if (witterItem.sec !== "0") {
            setStatus("Wait " + witterItem.sec + " sec");
          }
        }
      }
    }
  }, [gameRaw]);

  const { send: _move2, state: _stateMove2 } = write("move2");
  const { send: _claim, state: _stateClaim } = write("claim");
  const { send: _stop, state: _stateStop } = write("stop");

  const handleRequestMove = async (move: string) => {
    if (move.length === 3 || loading) return;

    setLoading(true);
    try {
      const res: any = await _move2(parseChain.name(name), id, move, {
        value: parseChain.value(room),
      });
      console.log("handleRequestMove", res);

      setClickHeads(false);
      setClickTails(false);

      setClickRock(false);
      setClickHeads(false);
      setClickPaper(false);

      setClickAttackHead("");
      setClickAttackBody("");
      setClickAttackLegs("");
      setClickDefenseHead("");
      setClickDefenseBody("");
      setClickDefenseLegs("");

      setLoading(false);
    } catch (e) {
      console.log("handleRequestMove", e);

      setClickHeads(false);
      setClickTails(false);

      setClickRock(false);
      setClickHeads(false);
      setClickPaper(false);

      setClickAttackHead("");
      setClickAttackBody("");
      setClickAttackLegs("");
      setClickDefenseHead("");
      setClickDefenseBody("");
      setClickDefenseLegs("");

      setLoading(false);
    }
  };

  const handleRequestClaim = async () => {
    const res: any = await _claim(
      parseChain.name(name),
      parseChain.room(room),
      id,
      player.move || "",
      player.proof || ""
    );
    console.log("handleRequestClaim", res);
  };

  const handleRequestStop = async () => {
    const res: any = await _stop(
      parseChain.name(name),
      parseChain.room(room),
      id
    );
    console.log("handleRequestStop", res);
  };

  return (
    <VStack spacing={5} mt="5">
      {gameItem && gameItem.move1 !== ethers.constants.AddressZero && (
        <Box>
          <Game game={gameItem} status={status}></Game>
        </Box>
      )}
      {gameItem &&
        witterItem &&
        witterItem.winner !== ethers.constants.AddressZero &&
        witterItem.winner === account &&
        gameItem.winner === ethers.constants.AddressZero &&
        gameItem.random !== "0" && (
          <Box>
            <Button
              onClick={handleRequestClaim}
              colorScheme="teal"
              variant="outline"
            >
              Claim Prize
            </Button>
          </Box>
        )}
      {status ? (
        <Box mt="10" textAlign="center">
          <Text fontSize="sm">Send your friend:</Text>
          <Kbd
            fontSize="sm"
            p="7"
            pb="1"
          >{`https://2players.app${pathname}`}</Kbd>
        </Box>
      ) : (
        <Box>
          <VStack spacing={5}>
            {name && name === "HeadsOrTails" && (
              <HStack spacing={5} my="10">
                <IconButton
                  as={motion.button}
                  animation={clickHeads || clickTails ? "none" : animation}
                  aria-label="Heads"
                  icon={clickHeads ? <Spinner size="xl" /> : <RiCoinFill />}
                  fontSize="8xl"
                  p="10"
                  onClick={() => {
                    setClickHeads(true);
                    handleRequestMove("1");
                  }}
                />
                <IconButton
                  as={motion.button}
                  animation={clickHeads || clickTails ? "none" : animation}
                  aria-label="Tails"
                  icon={clickTails ? <Spinner size="xl" /> : <RiCoinLine />}
                  fontSize="8xl"
                  p="10"
                  onClick={() => {
                    setClickTails(true);
                    handleRequestMove("2");
                  }}
                />
              </HStack>
            )}
            {name && name === "RockPaperScissors" && (
              <HStack spacing={5} my="10">
                <IconButton
                  as={motion.button}
                  animation={
                    clickRock || clickPaper || clickScissors
                      ? "none"
                      : animation
                  }
                  aria-label="Rock"
                  icon={clickRock ? <Spinner size="xl" /> : <FaHandRock />}
                  fontSize="6xl"
                  p="10"
                  onClick={() => {
                    setClickRock(true);
                    handleRequestMove("1");
                  }}
                />
                <IconButton
                  as={motion.button}
                  animation={
                    clickRock || clickPaper || clickScissors
                      ? "none"
                      : animation
                  }
                  aria-label="Paper"
                  icon={clickPaper ? <Spinner size="xl" /> : <FaHandPaper />}
                  fontSize="6xl"
                  p="10"
                  onClick={() => {
                    setClickPaper(true);
                    handleRequestMove("2");
                  }}
                />
                <IconButton
                  as={motion.button}
                  animation={
                    clickRock || clickPaper || clickScissors
                      ? "none"
                      : animation
                  }
                  aria-label="Scissors"
                  icon={
                    clickScissors ? <Spinner size="xl" /> : <FaHandScissors />
                  }
                  fontSize="6xl"
                  p="10"
                  onClick={() => {
                    setClickScissors(true);
                    handleRequestMove("3");
                  }}
                />
              </HStack>
            )}
            {name && name === "AttackAndDefense" && (
              <HStack spacing={5} my="10">
                <VStack spacing={5}>
                  <Box>Attack:</Box>
                  <IconButton
                    as={motion.button}
                    animation={
                      clickAttackHead || clickAttackBody || clickAttackLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Attack Head"
                    icon={
                      clickAttackHead ? (
                        <GiHeadshot color="red" />
                      ) : (
                        <GiHeadshot />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickAttackHead("211");
                      setClickAttackBody("");
                      setClickAttackLegs("");
                      handleRequestMove(
                        "211" +
                          (clickDefenseHead ||
                            clickDefenseBody ||
                            clickDefenseLegs)
                      );
                    }}
                  />
                  <IconButton
                    as={motion.button}
                    animation={
                      clickAttackHead || clickAttackBody || clickAttackLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Attack Body"
                    icon={
                      clickAttackBody ? (
                        <GiMuscularTorso color="red" />
                      ) : (
                        <GiMuscularTorso />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickAttackHead("");
                      setClickAttackBody("121");
                      setClickAttackLegs("");
                      handleRequestMove(
                        "121" +
                          (clickDefenseHead ||
                            clickDefenseBody ||
                            clickDefenseLegs)
                      );
                    }}
                  />
                  <IconButton
                    as={motion.button}
                    animation={
                      clickAttackHead || clickAttackBody || clickAttackLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Attack Legs"
                    icon={
                      clickAttackLegs ? (
                        <GiHieroglyphLegs color="red" />
                      ) : (
                        <GiHieroglyphLegs />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickAttackHead("");
                      setClickAttackBody("");
                      setClickAttackLegs("112");
                      handleRequestMove(
                        "112" +
                          (clickDefenseHead ||
                            clickDefenseBody ||
                            clickDefenseLegs)
                      );
                    }}
                  />
                </VStack>
                <VStack spacing={5}>
                  <Box>Defense:</Box>
                  <IconButton
                    as={motion.button}
                    animation={
                      clickDefenseHead || clickDefenseBody || clickDefenseLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Defense Head"
                    icon={
                      clickDefenseHead ? (
                        <GiClosedBarbute color="cyan" />
                      ) : (
                        <GiClosedBarbute />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickDefenseHead("211");
                      setClickDefenseBody("");
                      setClickDefenseLegs("");
                      handleRequestMove(
                        (clickAttackHead ||
                          clickAttackBody ||
                          clickAttackLegs) + "211"
                      );
                    }}
                  />
                  <IconButton
                    as={motion.button}
                    animation={
                      clickDefenseHead || clickDefenseBody || clickDefenseLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Defense Body"
                    icon={
                      clickDefenseBody ? (
                        <GiAbdominalArmor color="cyan" />
                      ) : (
                        <GiAbdominalArmor />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickDefenseHead("");
                      setClickDefenseBody("121");
                      setClickDefenseLegs("");
                      handleRequestMove(
                        (clickAttackHead ||
                          clickAttackBody ||
                          clickAttackLegs) + "121"
                      );
                    }}
                  />
                  <IconButton
                    as={motion.button}
                    animation={
                      clickDefenseHead || clickDefenseBody || clickDefenseLegs
                        ? "none"
                        : animation
                    }
                    aria-label="Defense Legs"
                    icon={
                      clickDefenseLegs ? (
                        <GiArmoredPants color="cyan" />
                      ) : (
                        <GiArmoredPants />
                      )
                    }
                    fontSize="5xl"
                    p="7"
                    onClick={() => {
                      setClickDefenseHead("");
                      setClickDefenseBody("");
                      setClickDefenseLegs("112");
                      handleRequestMove(
                        (clickAttackHead ||
                          clickAttackBody ||
                          clickAttackLegs) + "112"
                      );
                    }}
                  />
                </VStack>
              </HStack>
            )}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default Move2;
