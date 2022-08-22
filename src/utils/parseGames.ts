import parseGame from "./parseGame";

export default (rawGames: any[]) => {
  const result: any[] = [];

  if (rawGames && rawGames[0] && rawGames[0].value && rawGames[0].value[0]) {
    rawGames[0].value.forEach((v: any) => {
      if (v[2] === "0x0000000000000000000000000000000000000000") return;
      result.push(parseGame([{ value: [v] }]));
    });
  }

  return result;
};
