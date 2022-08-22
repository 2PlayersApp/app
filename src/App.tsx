import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  Text,
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
} from "react-router-dom";
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
        <Button>{children}</Button>
      </Link>
    </span>
  );
}

const Select = () => {
  const { nameUrl, roomUrl } = useParams();
  return (
    <Box>
      <CustomLink to={`HeadsOrTails/${roomUrl ?? "1MATIC"}`}>
        Heads Or Tails
      </CustomLink>{" "}
      |{" "}
      <CustomLink to={`RockPaperScissors/${roomUrl ?? "1MATIC"}`}>
        Rock Paper Scissors
      </CustomLink>{" "}
      |{" "}
      <CustomLink to={`AttackAndDefense/${roomUrl ?? "1MATIC"}`}>
        Attack And Defense
      </CustomLink>
      <Divider></Divider>
      <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/1MATIC`}>
        1 MATIC
      </CustomLink>{" "}
      |{" "}
      <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/10MATIC`}>
        10 MATIC
      </CustomLink>{" "}
      |{" "}
      <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/100MATIC`}>
        100 MATIC
      </CustomLink>{" "}
      |{" "}
      <CustomLink to={`${nameUrl ?? "HeadsOrTails"}/1000MATIC`}>
        1000 MATIC
      </CustomLink>
      <Divider></Divider>
      <CustomLink
        to={`${nameUrl ?? "HeadsOrTails"}/${roomUrl ?? "1MATIC"}/move`}
      >
        NEW GAME
      </CustomLink>
      <Outlet></Outlet>
    </Box>
  );
};

const Room = () => {
  const { nameUrl, roomUrl } = useParams();

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
    <Box maxW="container.sm">
      <Box>
        <Outlet></Outlet>
      </Box>
      <Box>
        <Games games={rawGames}></Games>
      </Box>
    </Box>
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

  const handleRequestMove2 = async () => {
    const m: any = await _move2(url.name, url.id, move, {
      value: parseChain.value(roomUrl),
    });
    console.log(m);
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

  return (
    <Box>
      <Center>
        <Divider></Divider>
        {g && g.id && <Game game={g}></Game>}
        <Divider></Divider>
        {status ? (
          <Box>
            <Text>{status}</Text>
            {status === "You Winner" && (
              <Button onClick={handleRequestClaim}>
                Claim prize You Winner
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            <RadioGroup onChange={setMove} value={move}>
              <Stack direction="row">
                <Radio value="1">Heads</Radio>
                <Radio value="2">Tails</Radio>
              </Stack>
            </RadioGroup>
            <Divider></Divider>
            <Button onClick={handleRequestMove2}>SEND 2</Button>
          </Box>
        )}
        <Divider></Divider>
      </Center>
      <Outlet></Outlet>
    </Box>
  );
};

const Move1 = () => {
  const { nameUrl, roomUrl } = useParams();
  const navigate = useNavigate();
  const [move, setMove] = useState("1");
  const [secret, setSecret] = useState({ phrase: "", proof: "", cipher: "" });

  useEffect(() => {
    const phrase =
      words[Math.floor(Math.random() * words.length)] +
      " " +
      words[Math.floor(Math.random() * words.length)] +
      " " +
      words[Math.floor(Math.random() * words.length)];
    const proof = solidityKeccak256(["string"], [phrase]);
    const cipher = solidityKeccak256(["uint256", "bytes32"], [move, proof]);
    setSecret({ phrase, proof, cipher });
  }, [move]);

  const nameId = parseChain.name(nameUrl);

  const { send: _move, state: _stateMove } = write("move1");

  const handleRequestMove = async () => {
    try {
      const m: any = await _move(nameId, secret.cipher, {
        value: parseChain.value(roomUrl),
      });
      const name = m.events[0].args.name.toString();
      const room = m.events[0].args.room.toString();
      const id = m.events[0].args.id.toString();
      localStorage.setItem(
        "game" + name + room + id,
        JSON.stringify({ name, room, id, move, ...secret }, null, 2)
      );
      navigate(`../${id}`, { replace: true });
    } catch (e) {
      console.log("handleRequestMove", e);
    }
  };

  return (
    <Box>
      <Divider></Divider>
      <RadioGroup onChange={setMove} value={move}>
        <Stack direction="row">
          <Radio value="1">Heads</Radio>
          <Radio value="2">Tails</Radio>
        </Stack>
      </RadioGroup>
      <Divider></Divider>
      <Button onClick={handleRequestMove}>
        SEND 1 (SECRET: {secret.phrase})
      </Button>
      <Divider></Divider>
      <Outlet></Outlet>
    </Box>
  );
};

function App() {
  const { account, activateBrowserWallet } = useEthers();

  return (
    <Box>
      <Text>{account}</Text>
      <Box
        as="button"
        onClick={() => {
          activateBrowserWallet();
        }}
      >
        Activate
      </Box>
      <Box>
        <Routes>
          <Route path="/" element={<Select></Select>}>
            <Route path=":nameUrl/:roomUrl" element={<Room></Room>}>
              <Route path="move" element={<Move1></Move1>} />
              <Route path=":idUrl" element={<Move2></Move2>} />
            </Route>
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
