import * as React from "React";
import { useState, useEffect } from "react";
import db from "../../../Firebase";
import firebase from "../../../Firebase";

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    GetReivews();
  }, []);

  // firebaseからデータを取得して表示する
  const GetReivews = async () => {
    const snapshot = await firebase.firestore().collection("reviews").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const ShowReviews = () => {
    return;
  };

  return (
    <div className="review-table">
      {reviews.map((review) => {
        return (
          <img
            src={review.dynamicFaceIcon}
            alt=""
            key={review.id}
            width={100}
          />
        );
      })}
      <button onClick={() => ShowReviews()}>データ取得</button>
    </div>
  );
};

export default ReviewTable;
