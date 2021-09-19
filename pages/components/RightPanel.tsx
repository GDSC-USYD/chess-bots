import styles from "../../styles/rightpanel.module.css";
import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Login from "./Login";
import Typography from "@material-ui/core/Typography";

const RightPanel = () => {
  return (
    <Box className={styles.root}>
      <Typography variant="h4" className={styles.title}>
        User Area
      </Typography>
      <Login />
    </Box>
  );
};

export default RightPanel;
