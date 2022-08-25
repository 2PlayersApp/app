import { ethers } from "ethers";
import parseGame from "./parseGame";

import { IGame, IGameRaw } from "../interfaces/IGame";

export default (gamesRaw: IGameRaw[]) => {
  const result: IGame[] = [];

  if (gamesRaw && gamesRaw[0] && gamesRaw[0].value && gamesRaw[0].value[0]) {
    gamesRaw.forEach((g) => {
      if (g.value[0][2] === ethers.constants.AddressZero) return;
      result.push(parseGame([g]));
    });
  }

  return result;
};
