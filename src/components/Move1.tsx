import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  IconButton,
  keyframes,
  Spinner,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { solidityKeccak256 } from "ethers/lib/utils";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RiCoinFill, RiCoinLine } from "react-icons/ri";
import { FaHandPaper, FaHandRock, FaHandScissors } from "react-icons/fa";
import {
  GiAbdominalArmor,
  GiHieroglyphLegs,
  GiHeadshot,
  GiMuscularTorso,
  GiArmoredPants,
  GiClosedBarbute,
} from "react-icons/gi";
import words from "../utils/words.json";
import { write } from "../queries";

import parseChain from "../utils/parseChain";

const animationKeyframes = keyframes`
  0% { transform: scale(1) }
  50% { transform: scale(1.1) }
  100% { transform: scale(1) }
`;
const animation = `${animationKeyframes} 1s ease-in-out infinite`;

const genSecret = (move: string) => {
  const phrase =
    words[Math.floor(Math.random() * words.length)] +
    " " +
    words[Math.floor(Math.random() * words.length)] +
    " " +
    words[Math.floor(Math.random() * words.length)];
  const proof = solidityKeccak256(["string"], [phrase]);
  const cipher = solidityKeccak256(["uint256", "bytes32"], [move, proof]);
  return { phrase, proof, cipher };
};

const Move1 = () => {
  const { name, room } = useParams();
  const navigate = useNavigate();

  const [howToPlay, setHowToPlay] = useState(false);

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

  const { send: _move, state: _stateMove } = write("move1");

  const handleRequestMove = async (move: string) => {
    if (move.length === 3 || loading) return;

    setLoading(true);
    try {
      const { phrase, proof, cipher } = genSecret(move);

      const move1: any = await _move(parseChain.name(name), cipher, {
        value: parseChain.value(room),
      });

      let id;
      if (move1 && move1.events && move1.events[0] && move1.events[0].args) {
        id = move1.events[0].args.id.toString();
      } else {
        id = move1.events[1].args.id.toString();
      }

      localStorage.setItem(
        ("game" + name + room + id).toLowerCase(),
        JSON.stringify({
          name: name?.toLowerCase(),
          room: room?.toLowerCase(),
          id,
          move,
          phrase,
          proof,
          cipher,
        })
      );

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

      navigate(`../${id}`, { replace: true });
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

  return (
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
              clickRock || clickPaper || clickScissors ? "none" : animation
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
              clickRock || clickPaper || clickScissors ? "none" : animation
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
              clickRock || clickPaper || clickScissors ? "none" : animation
            }
            aria-label="Scissors"
            icon={clickScissors ? <Spinner size="xl" /> : <FaHandScissors />}
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
                clickAttackHead ? <GiHeadshot color="red" /> : <GiHeadshot />
              }
              fontSize="5xl"
              p="7"
              onClick={() => {
                setClickAttackHead("211");
                setClickAttackBody("");
                setClickAttackLegs("");
                handleRequestMove(
                  "211" +
                    (clickDefenseHead || clickDefenseBody || clickDefenseLegs)
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
                    (clickDefenseHead || clickDefenseBody || clickDefenseLegs)
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
                    (clickDefenseHead || clickDefenseBody || clickDefenseLegs)
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
                  (clickAttackHead || clickAttackBody || clickAttackLegs) +
                    "211"
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
                  (clickAttackHead || clickAttackBody || clickAttackLegs) +
                    "121"
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
                  (clickAttackHead || clickAttackBody || clickAttackLegs) +
                    "112"
                );
              }}
            />
          </VStack>
        </HStack>
      )}

      <Alert
        status="success"
        variant="left-accent"
        borderRadius="lg"
        cursor="pointer"
      >
        {name && name === "HeadsOrTails" && (
          <Box>
            <AlertTitle
              textAlign="center"
              onClick={() => {
                setHowToPlay(!howToPlay);
              }}
            >
              How To Play?
            </AlertTitle>
            {howToPlay && (
              <AlertDescription>
                <Text>- Choose heads or tails</Text>
                <Text>- Wait for the second player move</Text>
                <Text>= If there is a tie, the winner is randomly</Text>
                <Text>- If you win, confirm your move (within 5 min)</Text>
              </AlertDescription>
            )}
          </Box>
        )}
        {name && name === "RockPaperScissors" && (
          <Box>
            <AlertTitle
              textAlign="center"
              onClick={() => {
                setHowToPlay(!howToPlay);
              }}
            >
              How To Play?
            </AlertTitle>
            {howToPlay && (
              <AlertDescription>
                <Text>- Choose rock or paper or scissors</Text>
                <Text>- Wait for the second player move</Text>
                <Text>= If there is a tie, the winner is randomly</Text>
                <Text>- If you win, confirm your move (within 5 min)</Text>
              </AlertDescription>
            )}
          </Box>
        )}
        {name && name === "AttackAndDefense" && (
          <Box>
            <AlertTitle
              textAlign="center"
              onClick={() => {
                setHowToPlay(!howToPlay);
              }}
            >
              How To Play?
            </AlertTitle>
            {howToPlay && (
              <AlertDescription>
                <Text>- Choose attack and defense</Text>
                <Text>- Wait for the second player move</Text>
                <Text>= If there is a tie, the winner is randomly</Text>
                <Text>- If you win, confirm your move (within 5 min)</Text>
              </AlertDescription>
            )}
          </Box>
        )}
      </Alert>
    </VStack>
  );
};

export default Move1;
