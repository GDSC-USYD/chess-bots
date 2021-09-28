import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import { User } from "../types/UserTypes";
import { useState, useEffect } from "react";
import { getGames, getUsers } from "./api/routes";
import { AlertItem } from "../types/UtilityTypes";

import RightPanel from "../components/RightPanel";
import LeftPanel from "../components/LeftPanel";

import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { Game } from "../types/GameTypes";

const Home: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [alertMessage, setAlertMessage] = useState<AlertItem | null>(null);

  useEffect(() => {
    const populate = async () => {
      setUsers(await getUsers());
      setGames(
        (await getGames()).sort((a, b) => {
          if (b.timestamp && a.timestamp)
            return b.timestamp.getTime() - a.timestamp.getTime();
          else if (b.timestamp) return -1;
          else if (a.timestamp) return -1;
          else return 0;
        })
      );
    };

    populate();
  }, []);

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
          <LeftPanel users={users} games={games} />
        </Box>

        <Box className={styles.right}>
          <RightPanel setAlertMessage={setAlertMessage} users={users} />
        </Box>
      </Box>
      {!!alertMessage && (
        <Snackbar
          open={!!alertMessage}
          autoHideDuration={6000}
          onClose={() => setAlertMessage(null)}
        >
          <Alert
            onClose={() => setAlertMessage(null)}
            severity={alertMessage.color}
          >
            {alertMessage.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Home;
