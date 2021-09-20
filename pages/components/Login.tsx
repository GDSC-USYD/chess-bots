import styles from "../../styles/rightpanel.module.css";
import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

type Input = { value: string; error?: string };
enum Screen {
  LOGIN,
  SIGNUP,
  FORGOT,
}

const Login = () => {
  const [email, setEmail] = useState<Input>({ value: "" });
  const [password, setPassword] = useState<Input>({ value: "" });
  const [username, setUsername] = useState<Input>({ value: "" });

  const [alert, setAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [screen, setScreen] = useState<Screen>(Screen.LOGIN);

  useEffect(() => {
    setEmail({ value: "" });
    setPassword({ value: "" });
    setUsername({ value: "" });
  }, [screen]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.value)
      setEmail((email) => {
        return { ...email, error: "Please enter an email address" };
      });

    if (!password.value)
      setPassword((password) => {
        return { ...password, error: "Please enter a password" };
      });

    if (password.value && email.value) {
      setEmail({ value: "" });
      setPassword({ value: "" });
    }
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.value)
      setEmail((email) => {
        return { ...email, error: "Please enter an email address" };
      });

    if (!password.value)
      setPassword((password) => {
        return { ...password, error: "Please enter a password" };
      });

    if (!username.value)
      setUsername((username) => {
        return { ...username, error: "Please enter a username" };
      });

    if (password.value && email.value && username.value) {
      setEmail({ value: "" });
      setPassword({ value: "" });
      setUsername({ value: "" });

      setAlert(true);
      setAlertMessage(
        "Succesfully registered! Check your email for a confirmation message"
      );
      setScreen(Screen.LOGIN);
    }
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.value)
      setEmail((email) => {
        return { ...email, error: "Please enter an email address" };
      });

    if (!username.value)
      setUsername((username) => {
        return { ...username, error: "Please enter a username" };
      });

    if (email.value && username.value) {
      setEmail({ value: "" });
      setUsername({ value: "" });

      setAlert(true);
      setAlertMessage("Password reset email sent!");
      setScreen(Screen.LOGIN);
    }
  };

  return (
    <Box>
      {screen === Screen.LOGIN ? (
        <>
          <form className={styles.form} onSubmit={onSubmit}>
            <TextField
              label="Email"
              type="email"
              error={email.error !== undefined}
              helperText={email.error}
              value={email.value}
              onChange={(e) => setEmail({ value: e.target.value })}
            />
            <div style={{ padding: "10px 0" }} />
            <TextField
              label="Password"
              type="password"
              error={password.error !== undefined}
              helperText={password.error}
              value={password.value}
              onChange={(e) => setPassword({ value: e.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.button}
              style={{ marginTop: "2rem" }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={styles.button}
              style={{ margin: "1rem 0 4rem" }}
              onClick={() => setScreen(Screen.FORGOT)}
            >
              Forgot Password
            </Button>
          </form>

          <Button
            variant="contained"
            color="secondary"
            className={styles.button}
            style={{ backgroundColor: "#EA8600" }}
            onClick={() => setScreen(Screen.SIGNUP)}
          >
            Create an Account
          </Button>
        </>
      ) : screen === Screen.SIGNUP ? (
        <>
          <form className={styles.form} onSubmit={signUp}>
            <TextField
              label="Username"
              type="text"
              error={username.error !== undefined}
              helperText={username.error}
              value={username.value}
              onChange={(e) => setUsername({ value: e.target.value })}
            />
            <div style={{ padding: "10px 0" }} />
            <TextField
              label="Email"
              type="email"
              error={email.error !== undefined}
              helperText={email.error}
              value={email.value}
              onChange={(e) => setEmail({ value: e.target.value })}
            />
            <div style={{ padding: "10px 0" }} />
            <TextField
              label="Password"
              type="password"
              error={password.error !== undefined}
              helperText={password.error}
              value={password.value}
              onChange={(e) => setPassword({ value: e.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.button}
              style={{ margin: "2rem 0" }}
            >
              Create Account
            </Button>
          </form>

          <Button
            variant="contained"
            color="secondary"
            className={styles.button}
            style={{ marginTop: "5rem 0" }}
            onClick={() => setScreen(Screen.LOGIN)}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <form className={styles.form} onSubmit={reset}>
            <TextField
              label="Username"
              type="text"
              error={username.error !== undefined}
              helperText={username.error}
              value={username.value}
              onChange={(e) => setUsername({ value: e.target.value })}
            />
            <div style={{ padding: "10px 0" }} />
            <TextField
              label="Email"
              type="email"
              error={email.error !== undefined}
              helperText={email.error}
              value={email.value}
              onChange={(e) => setEmail({ value: e.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.button}
              style={{ margin: "2rem 0" }}
            >
              Reset Password
            </Button>
          </form>

          <Button
            variant="contained"
            color="secondary"
            className={styles.button}
            style={{ marginTop: "5rem 0" }}
            onClick={() => setScreen(Screen.LOGIN)}
          >
            Cancel
          </Button>
        </>
      )}
      {alert && (
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={() => setAlert(false)}
        >
          <Alert
            onClose={() => {
              setAlert(false);
              setAlertMessage("");
            }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Login;
