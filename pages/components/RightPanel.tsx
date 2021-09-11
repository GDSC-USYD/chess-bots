import Leaderboard from "./Leaderboard";
import styles from "../../styles/right-panel.module.css";

import Box from "@material-ui/core/Box";

const RightPanel = () => {
  return (
    <Box className={styles.panel}>
      <Leaderboard
        users={[
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
          { id: 123, mmr: 1000, name: "Asdfsa" },
        ]}
      />
    </Box>
  );
};

export default RightPanel;
