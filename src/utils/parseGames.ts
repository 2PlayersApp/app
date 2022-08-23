import parseGame from "./parseGame";

export default (rawGames: any[]) => {
  const result: any[] = [];

  if (rawGames && rawGames[0] && rawGames[0].value && rawGames[0].value[0]) {
    rawGames.forEach((g: any) => {
      if (g.value[0][2] === "0x0000000000000000000000000000000000000000")
        return;
      result.push(parseGame([g]));
    });
  }

  return result;
};
