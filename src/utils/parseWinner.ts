export default (rawWinner: any) => {
  if (
    rawWinner &&
    rawWinner[0] &&
    rawWinner[0].value &&
    rawWinner[0].value[0]
  ) {
    return {
      winner: rawWinner[0].value[0],
      sec: rawWinner[0].value[1].toString(),
    };
  } else {
    return {
      winner: "0x0000000000000000000000000000000000000000",
      sec: "0",
    };
  }
};
