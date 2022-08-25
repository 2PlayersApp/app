export interface IGame {
  id: string;
  winner: string;
  player1: string;
  player2: string;
  move1: string;
  move2: string;
  time1: string;
  time2: string;
  random: string;
  proof: string;
  cipher: string;
}

export interface IGameRaw {
  value: [
    BigInt,
    string,
    string,
    string,
    BigInt,
    BigInt,
    BigInt,
    BigInt,
    BigInt,
    string,
    string
  ][];
}
