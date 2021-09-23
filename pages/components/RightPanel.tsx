import styles from "../../styles/rightpanel.module.css";
import React, { useEffect, useState } from "react";

import Box from "@material-ui/core/Box";
import Login from "./Login";
import Typography from "@material-ui/core/Typography";
import { AlertItem } from "../types/UtilityTypes";
import Submission from "./Submission";

interface Props {
  setAlertMessage: (alertItem: AlertItem) => void;
}

const RightPanel = ({ setAlertMessage }: Props) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("token") !== null);
  }, []);

  return (
    <Box className={styles.root}>
      <Typography variant="h4" className={styles.title}>
        User Area
      </Typography>
      {loggedIn ? (
        <Submission setAlertMessage={setAlertMessage} />
      ) : (
        <Login setLoggedIn={setLoggedIn} setAlertMessage={setAlertMessage} />
      )}
    </Box>
  );
};

export default RightPanel;
