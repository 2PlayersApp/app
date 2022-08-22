import { parseUnits } from "ethers/lib/utils";

const name = (name: string | undefined) => {
  if (name && name.toLowerCase() == "HeadsOrTails".toLowerCase()) {
    return "0";
  } else if (name && name.toLowerCase() == "RockPaperScissors".toLowerCase()) {
    return "1";
  } else if (name && name.toLowerCase() == "AttackAndDefense".toLowerCase()) {
    return "2";
  } else {
    return "0";
  }
};

const room = (room: string | undefined) => {
  if (room && room.toLowerCase() == "1MATIC".toLowerCase()) {
    return "0";
  } else if (room && room.toLowerCase() == "10MATIC".toLowerCase()) {
    return "1";
  } else if (room && room.toLowerCase() == "100MATIC".toLowerCase()) {
    return "2";
  } else if (room && room.toLowerCase() == "1000MATIC".toLowerCase()) {
    return "3";
  } else {
    return "0";
  }
};

const value = (room: string | undefined) => {
  if (room && room.toLowerCase() == "1MATIC".toLowerCase()) {
    return parseUnits("1", 10);
  } else if (room && room.toLowerCase() == "10MATIC".toLowerCase()) {
    return parseUnits("10", 10);
  } else if (room && room.toLowerCase() == "100MATIC".toLowerCase()) {
    return parseUnits("100", 10);
  } else if (room && room.toLowerCase() == "1000MATIC".toLowerCase()) {
    return parseUnits("1000", 10);
  } else {
    return parseUnits("1", 10);
  }
};

export default { name, room, value };
