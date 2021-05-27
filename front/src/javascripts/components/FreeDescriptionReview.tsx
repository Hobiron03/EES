import * as React from "React";
import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../../Firebase";

interface ReviewData {
  reviewerName: string;
  movieTitle: string;
  reviewTitle: string;
  reviewContent: string;
}

const FreeDescriptionReview = () => {
  const classes = useStyles();

  const [isPostReivew, setIsPostReview] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");

  const PostReivewData = async () => {
    //firebaseにレビューデータを送信

    const postData: ReviewData = {
      reviewerName,
      movieTitle,
      reviewTitle,
      reviewContent,
    };

    const reviewsCollectionReference = firebase
      .firestore()
      .collection("freeReviews");

    await reviewsCollectionReference.add(postData);

    setIsPostReview(true);
  };

  const HandleReviewerNameOnChange = (e) => {
    setReviewerName(e.target.value);
  };

  const HandleMovieTitleOnChange = (e) => {
    setMovieTitle(e.target.value);
  };

  const HandleReviewTitleOnChange = (e) => {
    setReviewTitle(e.target.value);
  };

  const HandleReviewContentOnChange = (e) => {
    setReviewContent(e.target.value);
  };

  const ReivewContet = () => {
    if (isPostReivew) {
      return (
        <div>
          <h2>レビュー送信完了</h2>
          <p>ありがとうございます。</p>
        </div>
      );
    } else {
      return (
        <div>
          <h2>レビューの作成</h2>
          <div className={classes.review}>
            <div className={classes.review__title}>
              <h3>名前</h3>
              <input
                className={classes.review__title__input}
                type="text"
                onChange={(e) => HandleReviewerNameOnChange(e)}
                placeholder="氏名を入力してください"
              />
            </div>
            <div className={classes.review__title}>
              <h3>作品名</h3>
              <input
                className={classes.review__title__input}
                type="text"
                onChange={(e) => HandleMovieTitleOnChange(e)}
                placeholder="作品名を入力してください"
              />
            </div>
            <div className={classes.review__title}>
              <h3>レビュータイトル</h3>
              <input
                className={classes.review__title__input}
                type="text"
                onChange={(e) => HandleReviewTitleOnChange(e)}
                placeholder="最も伝えたいポイントは何ですか？"
              />
            </div>
            <div className={classes.review__content}>
              <h3>レビュー内容</h3>
              <textarea
                className={classes.review__content__textarea}
                onChange={(e) => HandleReviewContentOnChange(e)}
                placeholder="感想など感じたことを書いてください"
                cols={6}
                rows={4}
              ></textarea>
            </div>
          </div>
          <div className={classes.okButton} onClick={() => PostReivewData()}>
            <p>完了</p>
          </div>
        </div>
      );
    }
  };

  return <div className={classes.freeDescriptionReview}>{ReivewContet()}</div>;
};

const useStyles = makeStyles((theme) => ({
  freeDescriptionReview: {
    width: 700,
    margin: "0 auto",
    marginBottom: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: "column",
  },
  review: {
    margin: "0 auto",
    alignItems: "center",
  },
  review__title: {
    width: 640,
    marginBottom: 50,
  },
  review__title__input: {
    width: 640,
    height: 30,
    fontSize: 15,
  },
  review__content: {},
  review__content__textarea: {
    width: 640,
    height: 260,
    maxWidth: 640,
    maxHeight: 260,
    fontSize: 15,
  },
  okButton: {
    margin: "0 auto",
    textAlign: "center",
    backgroundColor: "#5b71f5",
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    border: "solid 2px",
    width: 110,
    height: 50,
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "white",
      color: "#5b71f5",
    },
  },
}));

export default FreeDescriptionReview;
