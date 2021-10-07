import { useEffect, useState } from "react";
import styles from "../styles/game.module.css";
import * as ChessJS from "chess.js";
import { Chessboard } from "react-chessboard";

import Typography from "@material-ui/core/Typography";
import { processMove } from "../pages/api/routes";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface Props {
  botId: number | undefined;
}

type Winner = "white" | "black" | "draw";

const GamePlayer = ({ botId }: Props) => {
  const [game, setGame] = useState<any>(new Chess());
  const [winner, setWinner] = useState<Winner | null>(null);

  function safeGameMutate(modify: (game: any) => void) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const sendMove = async () => {
    if (!botId) return;
    const res = await processMove({ id: botId, fen: game.fen() });
    if (res) {
      const newGame = new Chess(res);
      setGame(newGame);
      if (newGame.in_draw()) setWinner("draw");
      else if (newGame.in_checkmate()) setWinner("black");
    } else {
      console.log("error sending move");
    }
  };

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (game.turn() === "b") return false;
    else if (winner) return false;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
    });
    if (move === null) return false;

    if (game.in_checkmate()) setWinner("white");
    sendMove();

    return true;
  }

  return (
    <div className={styles.player}>
      <Typography variant="h3" style={{ color: "white" }}>
        Play against Bot
      </Typography>
      {!!winner && (
        <Typography
          variant="h3"
          style={{ color: "white" }}
        >{`The winner is: ${winner}`}</Typography>
      )}
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        animationDuration={200}
      />
      <Typography variant="h5" style={{ color: "white" }}>
        Note: Only promotion to Queen permitted
      </Typography>
    </div>
  );
};

export default GamePlayer;
