import React, { useState } from "react";
import styles from "../../styles/rightpanel.module.css";
import { updateModelUrl } from "../api/routes";
import { AlertItem } from "../types/UtilityTypes";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

type Input = { value: string; error?: string };

interface Props {
  setAlertMessage: (alertItem: AlertItem) => void;
  setLoggedIn: (state: boolean) => void;
}

const Submission = ({ setAlertMessage, setLoggedIn }: Props) => {
  const [link, setLink] = useState<Input>({ value: "" });

  const validUrl = (str: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!link.value) {
      setLink((link) => {
        return { ...link, error: "Please enter a link" };
      });
      return;
    } else if (!validUrl(link.value)) {
      setLink((link) => {
        return { ...link, error: "Please enter a valid link" };
      });
      return;
    } else if (localStorage.getItem("token") === null) {
      setLink((link) => {
        return { ...link, error: "Please login to submit" };
      });
      return;
    }

    const res = await updateModelUrl(
      link.value,
      localStorage.getItem("token")!
    );

    if (res) {
      setAlertMessage({
        color: "success",
        message: "Succesfully submitted your model url!",
      });
      setLink({ value: "" });
    } else {
      setAlertMessage({
        color: "error",
        message: "Something went wrong, please try again",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Box className={`${styles.form} ${styles.box}`}>
      <Typography variant="h5" style={{ margin: "1rem 0" }}>
        Ready to Submit?
      </Typography>
      <Box style={{ textAlign: "center" }}>
        Insert a link to your model into the box below.
      </Box>
      <Box style={{ textAlign: "center" }}>
        Check out the instructions on the left for more details.
      </Box>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        style={{ width: "100%" }}
      >
        <TextField
          label="Model Link"
          type="text"
          error={link.error !== undefined}
          helperText={link.error}
          value={link.value}
          onChange={(e) => setLink({ value: e.target.value })}
          style={{ width: "100%" }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.button}
          style={{ marginTop: "2rem" }}
        >
          Submit
        </Button>
      </form>

      <Button
        variant="contained"
        color="secondary"
        className={styles.button}
        style={{ marginTop: "2rem" }}
        onClick={logout}
      >
        Log out
      </Button>
    </Box>
  );
};

export default Submission;
