import styles from "../styles/topbar.module.css";
import Image from "next/image";

import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const TopBar = () => {
  return (
    <Box className={styles.topbar}>
      <Image src="/logo.png" width="88" height="71" />
      <Typography variant="h4" className={styles.header}>
        GDSC USYD's Chess Bots Competition!
      </Typography>
    </Box>
  );
};

export default TopBar;
