import { Contract, utils } from "ethers";
import { TWOPLAYERS_CONTRACT } from "../constants";
import { TwoPlayers } from "../abi";

const contract = new Contract(
  TWOPLAYERS_CONTRACT,
  new utils.Interface(TwoPlayers)
);

const games = (
  name: string,
  room: string,
  first: number = 1,
  skip: number = 0,
  desc: boolean = false
) => {
  const calls = [];

  let i = skip <= 0 ? 1 : skip;
  for (; i <= first + skip; i++) {
    calls.push({
      contract,
      method: "getGame" + (desc ? "Desc" : ""),
      args: [name, room, i.toString()],
    });
  }

  return calls;
};

const game = (name: string, room: string, id: string) => {
  const calls = [];

  calls.push({
    contract,
    method: "getGame",
    args: [name, room, id],
  });

  return calls;
};

const user = (
  user: string,
  first: number = 1,
  skip: number = 0,
  desc: boolean = false
) => {
  const calls = [];

  let i = skip <= 0 ? 1 : skip;
  for (; i <= first + skip; i++) {
    calls.push({
      contract,
      method: "getUserGames" + (desc ? "Desc" : ""),
      args: [user, i.toString()],
    });
  }

  return calls;
};

const winner = (
  name: string,
  room: string,
  id: string,
  move: string,
  proof: string
) => {
  const calls = [];

  calls.push({
    contract,
    method: "winner",
    args: [name, room, id, move, proof],
  });

  return calls;
};

export { games, game, user, winner };
