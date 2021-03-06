import styles from "../styles/rightpanel.module.css";
import React, { useState, useEffect } from "react";
import { createUser, loginUser, forgotPassword } from "../pages/api/routes";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { Color } from "@material-ui/lab/Alert";
import { User } from "../types/UserTypes";

type Input = { value: string; error?: string };
type AlertItem = { color: Color; message: string };

enum Screen {
  LOGIN,
  SIGNUP,
  FORGOT,
}

interface Props {
  setLoggedIn: (loggedIn: boolean) => void;
  setAlertMessage: (alertItem: AlertItem) => void;
  users: User[];
}

const Login = ({ setLoggedIn, setAlertMessage, users }: Props) => {
  const [email, setEmail] = useState<Input>({ value: "" });
  const [password, setPassword] = useState<Input>({ value: "" });
  const [username, setUsername] = useState<Input>({ value: "" });

  const [screen, setScreen] = useState<Screen>(Screen.LOGIN);

  useEffect(() => {
    setEmail({ value: "" });
    setPassword({ value: "" });
    setUsername({ value: "" });
  }, [screen]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.value)
      setUsername((username) => {
        return { ...username, error: "Please enter an email address" };
      });

    if (!password.value)
      setPassword((password) => {
        return { ...password, error: "Please enter a password" };
      });

    if (password.value && username.value) {
      const res = await loginUser({
        username: username.value,
        password: password.value,
      });

      if (res) {
        localStorage.setItem("token", res);
        setAlertMessage({
          color: "success",
          message: "Succesfully logged in!",
        });
        setLoggedIn(true);
      } else {
        setAlertMessage({
          color: "error",
          message: "Incorrect username and password combination :(",
        });
      }

      setUsername({ value: "" });
      setPassword({ value: "" });
    }
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.value)
      setEmail((email) => {
        return { ...email, error: "Please enter an email address" };
      });

    if (!password.value) {
      setPassword((password) => {
        return { ...password, error: "Please enter a password" };
      });
    } else if (password.value.length < 8) {
      setPassword((password) => {
        return { ...password, error: "Password must be at least 8 characters" };
      });
    }

    if (!username.value) {
      setUsername((username) => {
        return { ...username, error: "Please enter a username" };
      });
    } else if (users.find((u) => u.username === username.value)) {
      setUsername((username) => {
        return { ...username, error: "Username already taken (too slow!)" };
      });
    }

    if (
      password.value &&
      email.value &&
      username.value &&
      password.value.length >= 8 &&
      !users.find((u) => u.username === username.value)
    ) {
      const res = await createUser({
        username: username.value,
        email: email.value,
        password: password.value,
      });
      if (res) {
        localStorage.setItem("token", res);
        setAlertMessage({
          color: "success",
          message: "Succesfully registered!",
        });
        setLoggedIn(true);
      } else {
        setAlertMessage({
          color: "error",
          message:
            "Something went wrong during registration (oops!). Please try again",
        });
      }

      setEmail({ value: "" });
      setPassword({ value: "" });
      setUsername({ value: "" });
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
      const res = await forgotPassword({
        username: username.value,
        email: email.value,
      });

      if (res) {
        setAlertMessage({
          color: "success",
          message: "Password reset email sent!",
        });

        setScreen(Screen.LOGIN);
        setEmail({ value: "" });
        setUsername({ value: "" });
      } else {
        setAlertMessage({
          color: "error",
          message:
            "Something went wrong (are you sure your details are right?)",
        });
      }
    }
  };

  return (
    <Box>
      {screen === Screen.LOGIN ? (
        <>
          <form className={styles.form} onSubmit={login}>
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
    </Box>
  );
};

export default Login;
