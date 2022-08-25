import { Contract, utils } from "ethers";
import { TWOPLAYERS_CONTRACT } from "../constants";
import { TwoPlayers } from "../abi";
import { Call } from "@usedapp/core";
import parseChain from "../utils/parseChain";

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
): Call[] => {
  const calls = [];

  let i = skip <= 0 ? 1 : skip;
  for (; i <= first + skip; i++) {
    calls.push({
      contract,
      method: "getGame" + (desc ? "Desc" : ""),
      args: [parseChain.name(name), parseChain.room(room), i.toString()],
    });
  }

  return calls;
};

const game = (name: string, room: string, id: string): Call[] => {
  const calls = [];

  calls.push({
    contract,
    method: "getGame",
    args: [parseChain.name(name), parseChain.room(room), id],
  });

  return calls;
};

const user = (
  user: string,
  first: number = 1,
  skip: number = 0,
  desc: boolean = false
): Call[] => {
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
): Call[] => {
  const calls = [];

  calls.push({
    contract,
    method: "winner",
    args: [parseChain.name(name), parseChain.room(room), id, move, proof],
  });

  return calls;
};

export { games, game, user, winner };
