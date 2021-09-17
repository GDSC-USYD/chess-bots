import styles from "../../styles/profilecard.module.css";
import { User } from "../types/UserTypes";
import Profile from "./Profile";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Button } from "@material-ui/core";

interface Props {
  user: User | undefined;
}

const ProfileCard = ({ user }: Props) => {
  return (
    <Card variant="elevation" className={styles.root}>
      <CardContent>
        {user ? (
          <div className={styles.details}>
            <Profile name={user.name} />
            <div className={styles.text}>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="subtitle1" style={{ color: "#707070" }}>
                {`MMR: ` + user.mmr}
              </Typography>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <AccountCircle style={{ marginRight: "1rem" }} />
            <Typography variant="subtitle1" style={{ color: "#707070" }}>
              Search a user to view their details
            </Typography>
          </div>
        )}
      </CardContent>
      <CardActions className={styles.action}>
        <Button disabled={!user}>
          Play against this player <ChevronRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
