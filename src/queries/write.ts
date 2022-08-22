import { useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { TWOPLAYERS_CONTRACT } from "../constants";
import { TwoPlayers } from "../abi";

export default (functionName: string) => {
  const contract = new Contract(
    TWOPLAYERS_CONTRACT,
    new utils.Interface(TwoPlayers)
  ) as any;

  return useContractFunction(contract, functionName, {
    gasLimitBufferPercentage: 10,
  });
};
