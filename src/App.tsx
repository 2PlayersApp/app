import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Kbd,
  keyframes,
  SimpleGrid,
  Spacer,
  Spinner,
  StackDivider,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useCalls, useEthers } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  useResolvedPath,
  LinkProps,
  Outlet,
  Route,
  Routes,
  useParams,
  useMatch,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import { GiCoinflip, GiHighKick, GiRock } from "react-icons/gi";
import { RiCoinFill, RiCoinLine } from "react-icons/ri";
import words from "./utils/words.json";
import { write, game, games, winner } from "./queries";
import parseGame from "./utils/parseGame";
import parseGames from "./utils/parseGames";
import parseWinner from "./utils/parseWinner";
import parseChain from "./utils/parseChain";

import Games from "./components/Games";

const animationKeyframes = keyframes`
  0% { transform: scale(1) }
  50% { transform: scale(1.2) }
  100% { transform: scale(1) }
`;

const animation = `${animationKeyframes} 2s ease-in-out infinite`;

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <span>
      <Link
        style={{
          textDecoration: match ? "overline" : "none",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </span>
  );
}

const Select = () => {
  const { nameUrl, roomUrl } = useParams();
  return (
    <VStack>
      <HStack spacing={4} align="center">
        <CustomLink to={`HeadsOrTails/${roomUrl ?? "1MATIC"}`}>
          <IconButton
            aria-label="Heads Or Tails"
            icon={<GiCoinflip />}
            fontSize="6xl"
            p="10"
            m="5"
          />
        </CustomLink>
        <CustomLink to={`HeadsOrTails/${roomUrl ?? "1MATIC"}`}>
          <IconButton
            aria-label="Rock Paper Scissors"
            icon={<GiRock />}
            fontSize="6xl"
            p="10"
            m="5"
            disabled
          />
        </CustomLink>
        <CustomLink to={`HeadsOrTails/${roomUrl ?? "1MATIC"}`}>
          <IconButton
            aria-label="Attack And Defense"
            icon={<GiHighKick />}
            fontSize="6xl"
            p="10"
            m="5"
            disabled
          />
        </CustomLink>
      </HStack>
      <HStack spacing={4} align="center">
        <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/1MATIC`}>
          <Button>1 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/10MATIC`}>
          <Button>10 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/100MATIC`}>
          <Button>100 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/1000MATIC`}>
          <Button>1000 MATIC</Button>
        </CustomLink>
      </HStack>
      <Outlet></Outlet>
    </VStack>
  );
};

const Room = () => {
  const { nameUrl, roomUrl, idUrl = "" } = useParams();
  const { pathname } = useLocation();

  const nameId = parseChain.name(nameUrl);
  const roomId = parseChain.room(roomUrl);

  let [query, setQuery] = useState<
    {
      contract: Contract;
      method: string;
      args: string[];
    }[]
  >([]);

  useEffect(() => {
    if (nameUrl && roomUrl) setQuery(games(nameId, roomId, 10, 0, true));
  }, [nameUrl, roomUrl]);

  const rawGames: any[] = parseGames(useCalls(query) ?? []);

  return (
    <VStack spacing={4} align="center">
      <Outlet></Outlet>

      {!(pathname.indexOf("/move") + 1) && !idUrl && (
        <VStack spacing={4} align="center">
          <CustomLink to="move">
            <Button m="5">NEW GAME</Button>
          </CustomLink>
          <SimpleGrid columns={2} spacing={10}>
            {rawGames && !!rawGames.length && <Games games={rawGames}></Games>}
          </SimpleGrid>
        </VStack>
      )}
    </VStack>
  );
};

const Move2 = () => {
  const { account } = useEthers();
  const { nameUrl, roomUrl, idUrl = "1" } = useParams();

  const name = parseChain.name(nameUrl);
  const room = parseChain.room(roomUrl);
  const id = idUrl.replace(/[^0-9]/g, "");

  const [url, setUrl] = useState({ name, room, id });
  const [move, setMove] = useState("2");
  const [player, setPlayer] = useState({
    name: "",
    room: "",
    id: "",
    move: "0",
    phrase: "",
    proof: "0x0000000000000000000000000000000000000000000000000000000000000000",
    cipher:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  });
  const [status, setStatus] = useState("");

  const g = parseGame(useCalls(game(name, room, id)) ?? []);

  const rawWinner =
    useCalls(winner(name, room, id, player.move, player.proof)) ?? [];
  const res = parseWinner(rawWinner);

  useEffect(() => {
    setUrl({ name, room, id });
    const s = localStorage.getItem("game" + name + room + id);
    if (s) setPlayer(JSON.parse(s));
  }, [nameUrl, roomUrl, idUrl]);

  useEffect(() => {
    if (!account || account === ethers.constants.AddressZero) return;
    if (g.player1 === account) {
      if (g.winner !== ethers.constants.AddressZero) {
        if (g.winner === account) {
          setStatus("Yeah! Play againe.");
        } else if (g.winner === g.player2) {
          setStatus("Hmmm! Game Over.");
        }
      } else {
        if (g.player2 === ethers.constants.AddressZero) {
          setStatus("Wait 2 player");
        } else {
          if (g.time2 === "0") {
            setStatus("Wait Random");
          } else {
            setStatus("Wait Result");
            if (res.winner === account) {
              if (res.sec === "0") {
                setStatus("You Winner");
              } else {
                setStatus("You Winner [ Time To Get " + res.sec + " sec ]");
              }
            } else {
              setStatus("You Loss");
            }
          }
        }
      }
    } else if (g.player2 === account) {
      if (g.winner !== ethers.constants.AddressZero) {
        if (g.winner === account) {
          setStatus("Yeah! Play againe.");
        } else if (g.winner === g.player1) {
          setStatus("Hmmm! Game Over.");
        }
      } else {
        if (g.time2 === "0") {
          setStatus("Wait Random");
        } else {
          setStatus("Wait Result");
          if (res.winner === account) {
            setStatus("Opponent Not Confirmed Move, You Winner!");
          } else if (res.sec !== "0") {
            setStatus("Wait " + res.sec + " sec [ Player 1 Confirm Move ]");
          }
        }
      }
    }
  }, [g]);

  const { send: _move2, state: _stateMove2 } = write("move2");
  const { send: _claim, state: _stateClaim } = write("claim");
  const { send: _stop, state: _stateStop } = write("stop");

  const handleRequestMove = async (move: string) => {
    try {
      const m: any = await _move2(url.name, url.id, move, {
        value: parseChain.value(roomUrl),
      });
      console.log(m);
      setClickHeads(false);
      setClickTails(false);
    } catch (e) {
      console.log("handleRequestMove", e);
      setClickHeads(false);
      setClickTails(false);
    }
  };

  const handleRequestClaim = async () => {
    const m: any = await _claim(
      url.name,
      url.room,
      url.id,
      player.move || "",
      player.proof || ""
    );
    console.log(m);
  };

  const handleRequestStop = async () => {
    const m: any = await _stop(url.name, url.room, url.id);
    console.log(m);
  };

  const [clickHeads, setClickHeads] = useState(false);
  const [clickTails, setClickTails] = useState(false);

  const { pathname } = useLocation();

  return (
    <VStack spacing={4}>
      {g && g.player1 && g.player2 && (
        <Box m="10">
          <Kbd>{g.player1.slice(0, 8) + "..." + g.player1.slice(-4)}</Kbd> vs{" "}
          <Kbd>{g.player2.slice(0, 8) + "..." + g.player2.slice(-4)}</Kbd>
        </Box>
      )}
      {status ? (
        <Box m="10" textAlign="center">
          <Kbd fontSize="2xl">{status}</Kbd>
          {!!(status.indexOf("Winner") + 1) ? (
            <Box m="5">
              <Button onClick={handleRequestClaim}>Claim Prize</Button>
            </Box>
          ) : (
            <Box>
              {!!(status.indexOf("Wait 2 player") + 1) ? (
                <Box m="5">
                  <Text fontSize="sm" mr="2">
                    Send your friend:
                  </Text>
                  <Kbd fontSize="sm">{`https://2players.app${pathname}`}</Kbd>
                </Box>
              ) : (
                ""
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {g &&
          g.winner &&
          g.winner !== "0x0000000000000000000000000000000000000000" &&
          (g.winner === g.player1 || g.winner === g.player2) ? (
            <Box m="5">
              <Kbd m="2">WINNER:</Kbd>
              {g.winner === g.player1 && (
                <Kbd>{g.player1.slice(0, 8) + "..." + g.player1.slice(-4)}</Kbd>
              )}
              {g.winner === g.player2 && (
                <Kbd>{g.player2.slice(0, 8) + "..." + g.player2.slice(-4)}</Kbd>
              )}
            </Box>
          ) : (
            g &&
            g.winner && (
              <Box my="5">
                <IconButton
                  as={motion.button}
                  animation={animation}
                  aria-label="Heads"
                  icon={clickHeads ? <Spinner size="xl" /> : <RiCoinFill />}
                  fontSize="6xl"
                  p="10"
                  m="5"
                  onClick={() => {
                    setClickHeads(true);
                    handleRequestMove("1");
                  }}
                />
                <IconButton
                  as={motion.button}
                  animation={animation}
                  aria-label="Tails"
                  icon={clickTails ? <Spinner size="xl" /> : <RiCoinLine />}
                  fontSize="6xl"
                  p="10"
                  m="5"
                  onClick={() => {
                    setClickTails(true);
                    handleRequestMove("2");
                  }}
                />
              </Box>
            )
          )}
        </Box>
      )}
    </VStack>
  );
};

const Move1 = () => {
  const { nameUrl, roomUrl } = useParams();
  const navigate = useNavigate();
  const [secret, setSecret] = useState({ phrase: "", proof: "", cipher: "" });

  const nameId = parseChain.name(nameUrl);
  const roomId = parseChain.room(roomUrl);

  const { send: _move, state: _stateMove } = write("move1");

  const handleRequestMove = async (move: string) => {
    try {
      const phrase =
        words[Math.floor(Math.random() * words.length)] +
        " " +
        words[Math.floor(Math.random() * words.length)] +
        " " +
        words[Math.floor(Math.random() * words.length)];
      const proof = solidityKeccak256(["string"], [phrase]);
      const cipher = solidityKeccak256(["uint256", "bytes32"], [move, proof]);

      const m: any = await _move(nameId, cipher, {
        value: parseChain.value(roomUrl),
      });
      let id;
      if (m && m.events && m.events[0] && m.events[0].args) {
        id = m.events[0].args.id.toString();
      } else {
        id = m.events[1].args.id.toString();
      }
      localStorage.setItem(
        "game" + nameId + roomId + id,
        JSON.stringify({
          name: nameId,
          room: roomId,
          id,
          move,
          phrase,
          proof,
          cipher,
        })
      );
      setClickHeads(false);
      setClickTails(false);
      setSecret({ phrase, proof, cipher });
      navigate(`../${id}`, { replace: true });
    } catch (e) {
      console.log("handleRequestMove", e);
      setClickHeads(false);
      setClickTails(false);
      setSecret({ phrase: "", proof: "", cipher: "" });
    }
  };

  const [clickHeads, setClickHeads] = useState(false);
  const [clickTails, setClickTails] = useState(false);

  return (
    <VStack spacing={4}>
      <Box my="5">
        <IconButton
          as={motion.button}
          animation={animation}
          aria-label="Heads"
          icon={clickHeads ? <Spinner size="xl" /> : <RiCoinFill />}
          fontSize="6xl"
          p="10"
          m="5"
          onClick={() => {
            setClickHeads(true);
            handleRequestMove("1");
          }}
        />
        <IconButton
          as={motion.button}
          animation={animation}
          aria-label="Tails"
          icon={clickTails ? <Spinner size="xl" /> : <RiCoinLine />}
          fontSize="6xl"
          p="10"
          m="5"
          onClick={() => {
            setClickTails(true);
            handleRequestMove("2");
          }}
        />
      </Box>
      {secret.phrase && (
        <Box>
          <Kbd mr="2">Game Passphrase:</Kbd>
          {secret.phrase.split(" ").map((k, i) => (
            <Kbd key={i} mx="1">
              {k}
            </Kbd>
          ))}
        </Box>
      )}
    </VStack>
  );
};

function App() {
  const { account, activateBrowserWallet } = useEthers();
  const [app, setApp] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const { pathname } = useLocation();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, []);

  return (
    <VStack spacing={10} align="stretch" p={2}>
      {(app || pathname !== "/") && (
        <Box>
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="3">
              <Heading size="md" color="white">
                <Link to="/">2Players.App</Link>
                <Text as="small" fontSize="xs">
                  {" "}
                  [ mumbai testnet ]
                </Text>
              </Heading>
            </Box>
            <Spacer />
            <Box p="3">
              {account && (
                <Text color="white">
                  {account.slice(0, 4) + "..." + account.slice(-2)}
                </Text>
              )}
              {!account && (
                <Button
                  colorScheme="gray"
                  onClick={() => {
                    activateBrowserWallet();
                  }}
                >
                  Connect
                </Button>
              )}
            </Box>
          </Flex>
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <Routes>
              <Route path="/" element={<Select></Select>}>
                <Route path=":nameUrl/:roomUrl" element={<Room></Room>}>
                  <Route path="move" element={<Move1></Move1>} />
                  <Route path=":idUrl" element={<Move2></Move2>} />
                </Route>
              </Route>
            </Routes>
          </VStack>
        </Box>
      )}
      {!app && pathname === "/" && (
        <VStack
          verticalAlign="center"
          textAlign="center"
          width="100%"
          height="100%"
          m="0"
          p="0"
          left="0"
          top="0"
          position="absolute"
          className="debug-blue"
        >
          <Spacer></Spacer>
          <Heading>2Players.App</Heading>
          <Text>WEB3 Platform For Build Decentralized Games</Text>
          <Button
            m="10"
            p="5"
            onClick={() => {
              setApp(true);
            }}
          >
            Launch App
          </Button>
          <Spacer></Spacer>
        </VStack>
      )}
    </VStack>
  );
}

export default App;
