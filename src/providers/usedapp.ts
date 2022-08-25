import { Config, Mumbai } from "@usedapp/core";
import { MULTICALL } from "../constants";

const config: Config = {
  readOnlyChainId: Mumbai.chainId,
  readOnlyUrls: {
    [Mumbai.chainId]:
      "https://polygon-mumbai.g.alchemy.com/v2/k5Xr7DanRifL-_q2Hmu7D8t1Mfl-frpA",
  },
  multicallAddresses: {
    [Mumbai.chainId]: MULTICALL,
  },
  noMetamaskDeactivate: true,
};

export default config;
