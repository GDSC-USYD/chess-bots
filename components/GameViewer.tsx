import { useEffect, useState } from "react";
import styles from "../styles/game.module.css";
import kokopu from "kokopu";
import { Chessboard } from "react-chessboard";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { List, ListItem, Typography } from "@material-ui/core";

interface Props {
  pgn: string;
}

const GameViewer = ({ pgn }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [position, setPosition] = useState<any>(new kokopu.Position("regular"));
  const [moves, setMoves] = useState<any>(
    kokopu
      .pgnRead(pgn)
      .game(0)
      .mainVariation()
      .nodes()
      .map((g: any) => g.notation())
  );

  const calculate = (moveNumber: number) => {
    const newPosition = new kokopu.Position("regular");
    for (let i = 0; i < moveNumber; i++) {
      newPosition.play(moves[i]);
    }

    setPosition(newPosition);
    setCurrentIndex(moveNumber);
  };

  return (
    <Box className={styles.root}>
      <Chessboard position={position.fen()} />
      <Box className={styles.controls}>
        <Box className={styles.moves}>
          <Box style={{ width: "50%" }}>
            <Typography variant="h5" className={styles.player}>
              White Moves
            </Typography>
            <Box className={styles.moveBox}>
              <List dense>
                {moves
                  .filter((m: string, i: number) => i % 2 == 0)
                  .map((m: string, i: number) => (
                    <ListItem
                      button
                      selected={i * 2 === currentIndex - 1}
                      onClick={(e) => calculate(i * 2 + 1)}
                    >
                      <Typography
                        variant="body1"
                        color={
                          i * 2 === currentIndex - 1 ? "primary" : undefined
                        }
                      >
                        {i * 2 === currentIndex - 1 ? <strong>{m}</strong> : m}
                      </Typography>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
          <Box style={{ width: "50%" }}>
            <Typography variant="h5" className={styles.player}>
              Black Moves
            </Typography>
            <Box className={styles.moveBox}>
              <List dense>
                {moves
                  .filter((m: string, i: number) => i % 2)
                  .map((m: string, i: number) => (
                    <ListItem
                      button
                      selected={i * 2 + 1 === currentIndex - 1}
                      onClick={(e) => calculate((i + 1) * 2)}
                    >
                      <Typography
                        variant="body1"
                        color={
                          i * 2 + 1 === currentIndex - 1 ? "primary" : undefined
                        }
                      >
                        {i * 2 + 1 === currentIndex - 1 ? (
                          <strong>{m}</strong>
                        ) : (
                          m
                        )}
                      </Typography>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
        </Box>
        <Slider
          color="primary"
          min={0}
          max={moves.length}
          value={currentIndex}
          onChange={(e, v) => calculate(v as number)}
        />
        <Box className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={currentIndex <= 0}
            onClick={() => calculate(currentIndex - 1)}
            fullWidth
          >
            <ArrowBack />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={!position.hasMove() || currentIndex >= moves.length}
            onClick={() => {
              calculate(currentIndex + 1);
            }}
            fullWidth
          >
            <ArrowForward />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GameViewer;
