import Leaderboard from "./Leaderboard";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import ProfileCard from "./ProfileCard";
import { User } from "../types/UserTypes";
import { Game } from "../types/GameTypes";
import GamesTable from "./GamesTable";
import styles from "../../styles/left-panel.module.css";

import { useState } from "react";

import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

// const users = [
//   { id: 123, mmr: 1000, username: "Asdfsa" },
//   { id: 124, mmr: 1000, username: "asdf" },
//   { id: 125, mmr: 1000, username: "xcvb" },
//   { id: 126, mmr: 1000, username: "Asdfsa" },
//   { id: 127, mmr: 1000, username: "d" },
//   { id: 128, mmr: 1000, username: "Asdfsa" },
//   { id: 129, mmr: 1000, username: "vbnm" },
//   { id: 111, mmr: 1000, username: "Asdfsa" },
//   { id: 1123, mmr: 1000, username: "Asdfsa" },
//   { id: 1233, mmr: 1000, username: "fghj" },
//   { id: 1234, mmr: 1000, username: "yu" },
//   { id: 1235, mmr: 1000, username: "Asdfsa" },
//   { id: 1236, mmr: 1000, username: "sehf" },
//   { id: 1237, mmr: 1000, username: "fghj" },
//   { id: 1238, mmr: 1000, username: "Asdfsa" },
//   { id: 1239, mmr: 1000, username: "dfghj" },
//   { id: 1230, mmr: 1000, username: "Asdfsa" },
//   { id: 12300, mmr: 1000, username: "Asdfsa" },
//   { id: 12311, mmr: 1000, username: "nbfg" },
// ];

const games: Game[] = [
  { player1: 123, player2: 124, winner: 124, timestamp: new Date() },
  { player1: 12300, player2: 128, winner: 128, timestamp: new Date() },
];

interface Props {
  users: User[];
}

const LeftPanel = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User["id"] | null>(null);

  return (
    <Box className={styles.panel}>
      <TopBar />
      <Leaderboard users={users} />
      <ExpandMoreIcon
        style={{ fontSize: "3rem", margin: "1rem 0 5rem", color: "#707070" }}
      />
      <Typography
        variant="h3"
        style={{ paddingBottom: "3rem", color: "#707070" }}
      >
        Player and Game Details
      </Typography>
      <SearchBar users={users} setSelectedUser={setSelectedUser} />
      <ProfileCard
        user={
          selectedUser ? users.find((u) => u.id === selectedUser) : undefined
        }
      />
      <GamesTable users={users} games={games} selectedUser={selectedUser} />
      <Box>
        <Typography
          variant="h3"
          style={{ paddingTop: "3rem", color: "#707070" }}
        >
          Instructions
        </Typography>
        Insert some instructions here
      </Box>
      <Box>
        <Typography
          variant="h3"
          style={{ paddingTop: "3rem", color: "#707070" }}
        >
          FAQs
        </Typography>
        Insert some FAQs here
      </Box>
    </Box>
  );
};

export default LeftPanel;
