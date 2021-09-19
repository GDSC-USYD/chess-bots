import styles from "../../styles/searchbar.module.css";
import { useState, useRef, useEffect } from "react";
import { User } from "../types/UserTypes";

import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import SearchIcon from "@material-ui/icons/Search";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

interface Props {
  users: User[];
  setSelectedUser: (userId: User["id"]) => void;
}

const SearchBar = ({ users, setSelectedUser }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search) setOpen(true);
  }, [search]);

  return (
    <>
      <Paper className={styles.root}>
        <div className={styles.left}>
          <PersonOutlineIcon className={styles.person} />
          <InputBase
            placeholder="Search and filter by a User"
            ref={anchorRef}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <IconButton disabled>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList>
                  {users
                    .filter((u) =>
                      u.username.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((u) => (
                      <MenuItem
                        key={u.id}
                        onClick={(event) => {
                          setSelectedUser(u.id);
                          setOpen(false);
                        }}
                      >
                        {u.username}
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SearchBar;
