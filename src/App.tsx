import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Kbd,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
  Text,
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
import { GiCoinflip, GiHighKick, GiRock } from "react-icons/gi";
import { RiCoinFill, RiCoinLine } from "react-icons/ri";
import words from "./utils/words.json";
import { write, game, games, winner } from "./queries";
import parseGame from "./utils/parseGame";
import parseGames from "./utils/parseGames";
import parseWinner from "./utils/parseWinner";
import parseChain from "./utils/parseChain";

import Games from "./components/Games";
import Game from "./components/Game";

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <span>
      <Link
        style={{ textDecoration: match ? "overline" : "none" }}
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
        </CustomLink>{" "}
        {/* <CustomLink to={`RockPaperScissors/${roomUrl ?? "1MATIC"}`}> */}
        <IconButton
          aria-label="Rock Paper Scissors"
          icon={<GiRock />}
          fontSize="6xl"
          p="10"
          m="5"
          disabled
        />
        {/* </CustomLink>{" "} */}
        {/* <CustomLink to={`AttackAndDefense/${roomUrl ?? "1MATIC"}`}> */}
        <IconButton
          aria-label="Attack And Defense"
          icon={<GiHighKick />}
          fontSize="6xl"
          p="10"
          m="5"
          disabled
        />
        {/* </CustomLink> */}
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
    if (nameUrl && roomUrl) setQuery(games(nameId, roomId, 10));
  }, [nameUrl, roomUrl]);

  const rawGames: any[] = parseGames(useCalls(query) ?? []);

  return (
    <VStack spacing={4} align="center">
      <Outlet></Outlet>

      {!(pathname.indexOf("/move") + 1) && !idUrl && (
        <VStack spacing={4} align="center">
          <CustomLink to="move">
            <Button>NEW GAME</Button>
          </CustomLink>
          {rawGames && rawGames.length && <Games games={rawGames}></Games>}
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
              setStatus("You Winner");
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
        }
      } else {
        if (g.time2 === "0") {
          setStatus("Wait Random");
        } else {
          setStatus("Wait Result");
          if (res.winner === account) {
            setStatus("You Winner");
          } else if (res.sec !== "0") {
            setStatus("Wait " + res.sec + " sec");
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

  return (
    <VStack spacing={4}>
      {g && g.player1 && g.player1 !== account && (
        <Box>
          <Kbd>YOU</Kbd> vs <Kbd>{g.player1}</Kbd>
        </Box>
      )}
      {status ? (
        <Box m="10">
          <Kbd>{status}</Kbd>
          {status === "You Winner" && (
            <Button onClick={handleRequestClaim}>Claim Prize</Button>
          )}
        </Box>
      ) : (
        <Box my="5">
          <IconButton
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
      )}
    </VStack>
  );
};

const Move1 = () => {
  const { nameUrl, roomUrl } = useParams();
  const navigate = useNavigate();
  const [secret, setSecret] = useState({ phrase: "", proof: "", cipher: "" });

  const nameId = parseChain.name(nameUrl);

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
      setSecret({ phrase, proof, cipher });

      const m: any = await _move(nameId, cipher, {
        value: parseChain.value(roomUrl),
      });
      const name = m.events[0].args.name.toString();
      const room = m.events[0].args.room.toString();
      const id = m.events[0].args.id.toString();
      localStorage.setItem(
        "game" + name + room + id,
        JSON.stringify({ name, room, id, move, ...secret }, null, 2)
      );
      setClickHeads(false);
      setClickTails(false);
      navigate(`../${id}`, { replace: true });
    } catch (e) {
      console.log("handleRequestMove", e);
      setClickHeads(false);
      setClickTails(false);
    }
  };

  const [clickHeads, setClickHeads] = useState(false);
  const [clickTails, setClickTails] = useState(false);

  return (
    <VStack spacing={4}>
      <Box my="5">
        <IconButton
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
          <Kbd mr="2">Secret worlds:</Kbd>
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

  return (
    <VStack spacing={10} align="stretch" p={2}>
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Box p="2">
          <Heading size="md">2Players.App</Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap="2">
          {account && (
            <Text>
              {account[0] + account[1] + account[2] + account[3]}
              ...
              {account[account.length - 2] + account[account.length - 1]}
            </Text>
          )}
          {!account && (
            <Button
              colorScheme="teal"
              onClick={() => {
                activateBrowserWallet();
              }}
            >
              Connect
            </Button>
          )}
        </ButtonGroup>
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
    </VStack>
  );
}

export default App;
