import { User } from "../types/UserTypes";
import styles from "../../styles/leaderboard.module.css";

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
  users: User[];
}
// TODO: coloring of table?
// TODO: highlight yourself automatically
// TODO: sorting (do we really need this?)
const Leaderboard = ({ users }: Props) => {
  return (
    <Paper className={styles.paper}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h4">Leaderboard</Typography>
      </Toolbar>

      <TableContainer className={styles.container}>
        <Table padding="normal" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length ? (
              users.map((u) => (
                <TableRow hover key={u.id}>
                  <TableCell align="center">{u.name}</TableCell>
                  <TableCell align="center">{u.mmr}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body1">
                    No users yet! Why not be the first?
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard;
