import * as React from "react";
import Avatar from "@material-ui/core/Avatar";

interface Props {
  name: string;
}

const Profile = ({ name }: Props) => {
  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name: string) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${
        name.includes(" ")
          ? name.split(" ")[0][0] + name.split(" ")[1][0]
          : name.length >= 2
          ? name[0] + name[1]
          : name[0]
      }`,
    };
  };

  return <Avatar {...stringAvatar(name)} />;
};

export default Profile;
