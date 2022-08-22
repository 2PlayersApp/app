export default (rawGame: any) => {
  let id,
    winner,
    player1,
    player2,
    move1,
    move2,
    time1,
    time2,
    random,
    proof,
    cipher;

  if (rawGame && rawGame[0] && rawGame[0].value && rawGame[0].value[0]) {
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
    ] = rawGame[0].value[0].map((v: any) => {
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
