import { IGame, IGameRaw } from "../interfaces/IGame";

export default (gameRaw: IGameRaw[]): IGame => {
  let id = "",
    winner = "",
    player1 = "",
    player2 = "",
    move1 = "",
    move2 = "",
    time1 = "",
    time2 = "",
    random = "",
    proof = "",
    cipher = "";

  if (gameRaw && gameRaw[0] && gameRaw[0].value && gameRaw[0].value[0]) {
    [
      id,
      winner,
      player1,
      player2,
      move1,
      move2,
      time1,
      time2,
      random,
      proof,
      cipher,
    ] = gameRaw[0].value[0].map((v) => {
      return v.toString();
    });
  }

  return {
    id,
    winner,
    player1,
    player2,
    move1,
    move2,
    time1,
    time2,
    random,
    proof,
    cipher,
  };
};
