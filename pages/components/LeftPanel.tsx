import Leaderboard from "./Leaderboard";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import { User } from "../types/UserTypes";
import styles from "../../styles/left-panel.module.css";

import { useState } from "react";

import Box from "@material-ui/core/Box";

const users = [
  { id: 123, mmr: 1000, name: "Asdfsa" },
  { id: 124, mmr: 1000, name: "asdf" },
  { id: 125, mmr: 1000, name: "xcvb" },
  { id: 126, mmr: 1000, name: "Asdfsa" },
  { id: 127, mmr: 1000, name: "d" },
  { id: 128, mmr: 1000, name: "Asdfsa" },
  { id: 129, mmr: 1000, name: "vbnm" },
  { id: 111, mmr: 1000, name: "Asdfsa" },
  { id: 1123, mmr: 1000, name: "Asdfsa" },
  { id: 1233, mmr: 1000, name: "fghj" },
  { id: 1234, mmr: 1000, name: "yu" },
  { id: 1235, mmr: 1000, name: "Asdfsa" },
  { id: 1236, mmr: 1000, name: "sehf" },
  { id: 1237, mmr: 1000, name: "fghj" },
  { id: 1238, mmr: 1000, name: "Asdfsa" },
  { id: 1239, mmr: 1000, name: "dfghj" },
  { id: 1230, mmr: 1000, name: "Asdfsa" },
  { id: 12300, mmr: 1000, name: "Asdfsa" },
  { id: 12311, mmr: 1000, name: "nbfg" },
];

const LeftPanel = () => {
  const [selectedUser, setSelectedUser] = useState<User["id"] | null>(null);

  return (
    <Box className={styles.panel}>
      <TopBar />
      <Leaderboard users={users} />
      <div style={{ padding: "5rem 0" }}></div>
      <SearchBar users={users} setSelectedUser={setSelectedUser} />
      <div style={{ padding: "5rem 0" }}></div>
    </Box>
  );
};

export default LeftPanel;
