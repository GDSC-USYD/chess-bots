import { User } from "../types/UserTypes";
import styles from "../styles/leaderboard.module.css";
import { Game } from "../types/GameTypes";
import { useState } from "react";
import GameViewer from "./GameViewer";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

interface Props {
  games: Game[];
  users: User[];
  selectedUser: User["id"] | null;
}

const GamesTable = ({ games, users, selectedUser }: Props) => {
  return (
    <Paper className={styles.paper}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h4">Recent Games</Typography>
      </Toolbar>

      <TableContainer className={styles.container}>
        <Table padding="normal">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Matchup</TableCell>
              <TableCell align="center">Winner</TableCell>
              <TableCell align="center">Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {games.filter(
              (g) =>
                selectedUser === null ||
                g.player1 === selectedUser ||
                g.player2 === selectedUser
            ).length ? (
              games
                .filter(
                  (g) =>
                    selectedUser === null ||
                    g.player1 === selectedUser ||
                    g.player2 === selectedUser
                )
                .map((g) => <CollapsibleRow users={users} g={g} />)
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">No matches found :(</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GamesTable;

interface CollapsibleProps {
  users: User[];
  g: Game;
}

const CollapsibleRow = ({ users, g }: CollapsibleProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [viewGame, setViewGame] = useState<boolean>(false);

  const download = (g: Game) => {
    const blob = new Blob([g.pgn]);
    var a = document.createElement("a");
    a.download = `game.pgn`;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const parseFlag = (g: Game): string => {
    switch (g.status) {
      case 2:
        return "Match complete - Tied result!";
      case 1:
        return "Match complete!";
      case -1:
        return "Match couldn't be processed - Invalid model link detected!";
      case -2:
        return "Match couldn't be processed - Invalid model detected!";
      case -3:
        return "Match couldn't be processed";
      default:
        return "Match complete!";
    }
  };

  return (
    <>
      <TableRow
        hover
        key={g.timestamp?.toString() + g.pgn}
        onClick={() => setOpen(!open)}
      >
        <TableCell size="small">
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </TableCell>
        <TableCell align="center">
          {(users.find((u) => u.id === g.player1)?.username ?? "???") +
            " vs " +
            (users.find((u) => u.id === g.player2)?.username ?? "???")}
        </TableCell>
        <TableCell align="center">
          {g.winner
            ? users.find((u) => u.id === g.winner)?.username ?? "???"
            : "-"}
        </TableCell>
        <TableCell align="center">
          {g.timestamp?.toLocaleString() ?? "???"}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ textAlign: "center" }}
              >
                {parseFlag(g)}
              </Typography>
              <Box className={styles.collapsible}>
                <Box className={styles.verticalflex}>
                  <Typography
                    variant="body1"
                    style={{
                      color: `${
                        g.winner === g.player1 ? "#34A853" : "#f50057"
                      }`,
                    }}
                  >
                    {(users.find((u) => u.id === g.player1)?.username ??
                      "???") +
                      ` (${g.mmrChange1 > 0 ? "+" : "-"}${Math.abs(
                        g.mmrChange1
                      )})`}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      color: `${
                        g.winner === g.player2 ? "#34A853" : "#f50057"
                      }`,
                    }}
                  >
                    {(users.find((u) => u.id === g.player2)?.username ??
                      "???") +
                      ` (${g.mmrChange2 > 0 ? "+" : "-"}${Math.abs(
                        g.mmrChange2
                      )})`}
                  </Typography>
                </Box>
                <Box className={styles.horizontalflex}>
                  <Button
                    color="primary"
                    variant={viewGame ? "contained" : "outlined"}
                    style={{ marginRight: "1rem" }}
                    disabled={g.status < 0}
                    onClick={() => setViewGame((viewGame) => !viewGame)}
                  >
                    View this Game
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => download(g)}
                    disabled={g.status < 0}
                  >
                    Download PGN File
                  </Button>
                </Box>
              </Box>
            </Box>
            {viewGame && (
              <Box>
                <GameViewer pgn={g.pgn} />
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
