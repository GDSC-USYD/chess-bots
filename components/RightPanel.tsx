import styles from "../styles/rightpanel.module.css";
import React, { useEffect, useState } from "react";
import { AlertItem } from "../types/UtilityTypes";
import Submission from "./Submission";
import Login from "./Login";
import { User } from "../types/UserTypes";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface Props {
  setAlertMessage: (alertItem: AlertItem) => void;
  users: User[];
}

const RightPanel = ({ setAlertMessage, users }: Props) => {
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
        <Submission
          setAlertMessage={setAlertMessage}
          setLoggedIn={setLoggedIn}
        />
      ) : (
        <Login
          setLoggedIn={setLoggedIn}
          setAlertMessage={setAlertMessage}
          users={users}
        />
      )}
    </Box>
  );
};

export default RightPanel;
