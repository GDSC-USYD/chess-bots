import Leaderboard from "./Leaderboard";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import ProfileCard from "./ProfileCard";
import { User } from "../types/UserTypes";
import { Game } from "../types/GameTypes";
import GamesTable from "./GamesTable";
import InstructionCard from "./InstructionCard";
import styles from "../styles/leftpanel.module.css";

import { useState } from "react";

import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import ArrowRight from "@material-ui/icons/ArrowRight";
import GamePlayer from "./GamePlayer";
import { Modal } from "@material-ui/core";

interface Props {
  users: User[];
  games: Game[];
}

const LeftPanel = ({ users, games }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User["id"] | null>(null);

  const [open, setOpen] = useState<boolean>(false);

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
        setOpen={setOpen}
      />
      <GamesTable users={users} games={games} selectedUser={selectedUser} />
      <Container className={styles.instructions} style={{ maxWidth: "40%" }}>
        <Typography
          variant="h3"
          style={{ paddingTop: "3rem", color: "#707070" }}
        >
          Instructions
        </Typography>
        <InstructionCard
          step={1}
          text="Welcome to GDSC USYD's first ever chess competition in collaboration
          with USYD Chess Club! First off make sure to join our discord."
        >
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              target="_blank"
              href="https://discord.gg/WVunGdcYMB"
            >
              <ArrowRight />
            </Button>
          </CardActions>
        </InstructionCard>
        <InstructionCard
          step={2}
          text="Ask to get added to the chess-bots channel. Inside you will find detailed steps, links to material and a starter template."
        />
        <InstructionCard
          step={3}
          text="Attend our two consultation sessions and ask questions in our channel for any help you need."
        />
        <InstructionCard
          step={4}
          text="Register on the right hand side with a username, email and password to create an account."
        />
        <InstructionCard
          step={5}
          text="When you're ready, submit your chess bot model (a link with viewable permissions from Google Drive)."
        />
        <InstructionCard
          step={6}
          text="Your bot will automatically verse others over time. Use the game viewer to watch the outcome of each match and improve your model. You can submit as many times as you want before the competition ends."
        />
      </Container>
      <Box>
        <Typography
          variant="h3"
          style={{ paddingTop: "3rem", color: "#707070" }}
        >
          FAQs
        </Typography>
        We'll put your FAQs here :)
      </Box>
      <Modal
        open={open && selectedUser !== null}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") setOpen(false);
        }}
      >
        <GamePlayer
          botId={
            selectedUser
              ? users.find((u) => u.id === selectedUser)?.id
              : undefined
          }
        />
      </Modal>
    </Box>
  );
};

export default LeftPanel;
