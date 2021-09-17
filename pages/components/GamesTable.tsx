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
}
// TODO: coloring of table?
// TODO: highlight yourself automatically
// TODO: sorting (do we really need this?)
const GamesTable = ({ games, users }: Props) => {
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
            {games.length ? (
              games.map((g) => (
                <TableRow hover key={g.timestamp.toString()}>
                  <TableCell align="center">
                    {(users.find((u) => u.id === g.player1)?.name ?? "???") +
                      " vs " +
                      (users.find((u) => u.id === g.player2)?.name ?? "???")}
                  </TableCell>
                  <TableCell align="center">
                    {users.find((u) => u.id === g.player1)?.name ?? "???"}
                  </TableCell>
                  <TableCell align="center">
                    {g.timestamp.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
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
