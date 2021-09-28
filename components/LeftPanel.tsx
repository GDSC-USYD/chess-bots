import Leaderboard from "./Leaderboard";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import ProfileCard from "./ProfileCard";
import { User } from "../types/UserTypes";
import { Game } from "../types/GameTypes";
import GamesTable from "./GamesTable";
import styles from "../styles/left-panel.module.css";

import { useState } from "react";

import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

interface Props {
  users: User[];
  games: Game[];
}

const LeftPanel = ({ users, games }: Props) => {
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
        Register with a Bot/User name, email and password on the right hand side panel. Then submit your Chess Bot model (shared viewable link from Google Drive) to enter your bot into the competition!
      </Box>
      <Box>
        <Typography
          variant="h3"
          style={{ paddingTop: "3rem", color: "#707070" }}
        >
          FAQs
        </Typography>
        We'll put your FAQs here :)
      </Box>
    </Box>
  );
};

export default LeftPanel;
