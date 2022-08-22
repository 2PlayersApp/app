import Game from "./Game";

const Games = ({ games }: { games: any }) => {
  return (
    <>
      {games &&
        games.map((game: any) => <Game key={game.id} game={game}></Game>)}
    </>
  );
};

export default Games;
