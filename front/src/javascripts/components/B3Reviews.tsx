import * as React from "React";
import { useState, useEffect } from "react";
import firebase from "../../../Firebase";

interface ReivewData {
  dynamicFaceIcon: string;
  title: string;
  canvasImage: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
  emotions: Array<string>;
}

const B3Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<ReivewData>({
    dynamicFaceIcon: "",
    title: "",
    canvasImage: "",
    EmotionalFaceIcon: [],
    comments: [],
    emotions: [],
  });
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

  useEffect(() => {
    GetReivews();
  }, []);

  const GetReivews = async () => {
    const snapshot = await firebase.firestore().collection("reviewsB3").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  return (
    <div>
      {reviews.map((review, index) => {
        return <p>・{review.title}</p>;
      })}
    </div>
  );
};

export default B3Reviews;
