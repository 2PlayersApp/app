import { Button, HStack, IconButton, VStack } from "@chakra-ui/react";
import {
  useResolvedPath,
  LinkProps,
  Outlet,
  useParams,
  useMatch,
  Link,
} from "react-router-dom";
import { GiCoinflip, GiHighKick, GiRock } from "react-icons/gi";

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <span>
      <Link
        style={{
          textDecoration: match ? "overline" : "none",
          color: match ? "white" : "gray",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </span>
  );
}

const Menu = () => {
  const { name, room } = useParams();
  return (
    <VStack>
      <HStack spacing={4} align="center">
        <CustomLink to={`HeadsOrTails/${room ?? "1MATIC"}`}>
          <IconButton
            aria-label="Heads Or Tails"
            icon={<GiCoinflip />}
            fontSize="6xl"
            p="10"
            m="5"
          />
        </CustomLink>
        <CustomLink to={`RockPaperScissors/${room ?? "1MATIC"}`}>
          <IconButton
            aria-label="Rock Paper Scissors"
            icon={<GiRock />}
            fontSize="6xl"
            p="10"
            m="5"
          />
        </CustomLink>
        <CustomLink to={`AttackAndDefense/${room ?? "1MATIC"}`}>
          <IconButton
            aria-label="Attack And Defense"
            icon={<GiHighKick />}
            fontSize="6xl"
            p="10"
            m="5"
          />
        </CustomLink>
      </HStack>
      <HStack spacing={4} align="center">
        <CustomLink to={`${name ?? "HeadsOrTails"}/1MATIC`}>
          <Button>1 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${name ?? "HeadsOrTails"}/10MATIC`}>
          <Button>10 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${name ?? "HeadsOrTails"}/100MATIC`}>
          <Button>100 MATIC</Button>
        </CustomLink>{" "}
        <CustomLink to={`${name ?? "HeadsOrTails"}/1000MATIC`}>
          <Button>1000 MATIC</Button>
        </CustomLink>
      </HStack>
      <Outlet></Outlet>
    </VStack>
  );
};

export default Menu;
