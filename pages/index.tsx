import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Box from "@material-ui/core/Box";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default Home;
