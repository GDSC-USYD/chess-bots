import styles from "../styles/leftpanel.module.css";

import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";

interface Props {
  step: number;
  text: string;
  children?: React.ReactNode;
}

const InstructionCard = ({ step, text, children }: Props) => {
  return (
    <Card style={{ margin: "1rem 0" }}>
      <div className={styles.card}>
        <Avatar style={{ backgroundColor: "#3f51b5", margin: "0 1rem" }}>
          {step}
        </Avatar>
        <CardContent>{text}</CardContent>
        {children}
      </div>
    </Card>
  );
};

export default InstructionCard;
