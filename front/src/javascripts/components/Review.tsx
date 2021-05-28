import * as React from "React";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface ReviewProps {
  title: string;
  faceIconURL: string;
  onClick: Function;
}

export const Review = (props: ReviewProps) => {
  const classes = useStyles();

  const HandleOnClick = () => {
    //モーダルを開く
    props.onClick();
  };

  return (
    <div className={classes.paper} onClick={() => HandleOnClick()}>
      <div>
        <div className={classes.title}>
          <p>{props.title}</p>
        </div>
        <div className={classes.content}>
          <img className={classes.faceIcon} src={props.faceIconURL} alt="" />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 210,
    margin: "20px 10px",
    border: "1px solid #000",
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1, 0, 1),
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    borderBottom: "1px solid #505050",
    fontSize: 10,
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  faceIcon: {
    width: 100,
    height: 100,
  },
}));

export default Review;
