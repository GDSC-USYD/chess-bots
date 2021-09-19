import { User } from "../types/UserTypes";
import styles from "../../styles/leaderboard.module.css";
import { Game } from "../types/GameTypes";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

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
                .map((g) => (
                  <TableRow hover key={g.timestamp.toString()}>
                    <TableCell align="center">
                      {(users.find((u) => u.id === g.player1)?.username ??
                        "???") +
                        " vs " +
                        (users.find((u) => u.id === g.player2)?.username ??
                          "???")}
                    </TableCell>
                    <TableCell align="center">
                      {users.find((u) => u.id === g.player1)?.username ?? "???"}
                    </TableCell>
                    <TableCell align="center">
                      {g.timestamp.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
