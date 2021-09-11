import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";

import RightPanel from "./components/RightPanel";
import LeftPanel from "./components/LeftPanel";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const Home: NextPage = () => {
  return (
    <Box className={styles.container}>
      <Head>
        <title>GDSC Chess Bots</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <Box className={styles.grid}>
        <Box className={styles.left}>
          <LeftPanel />
        </Box>

        <Box className={styles.right}>
          <RightPanel />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
