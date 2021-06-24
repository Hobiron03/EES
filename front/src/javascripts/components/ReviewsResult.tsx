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

interface FreeReivewData {
  movieTitle: string;
  reviewContent: string;
  reviewTitle: string;
  reviewerName: string;
}

const ReviewsResult = () => {
  const [freeReviews, setFreeReviews] = useState([]);
  const [orgnizedReview, setOrgnizedReview] = useState({});

  const [proposeReviews, seProposeReviews] = useState([]);
  const [proposeReview, seProposeReview] = useState({});

  useEffect(() => {
    GetFreeReivews();
    // GetProposeReivews();
  }, []);

  const GetFreeReivews = async () => {
    const snapshot = await firebase.firestore().collection("freeReviews").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setFreeReviews(reviews);
  };

  const GetProposeReivews = async () => {
    const snapshot = await firebase.firestore().collection("freeReviews").get();
    const proposeReviews = snapshot.docs.map((doc) => doc.data());
    seProposeReviews(proposeReviews);
  };

  const OrgnizeReviewData = () => {
    //以下の形式にデータを整形する
    let orgnizedReview = {
      // reviewerName: [{}, {}, {}],
      // reviewerName2: [{}, {}, {}],
    };
    freeReviews.forEach((freeReview: FreeReivewData, index) => {
      if (freeReview.reviewerName in orgnizedReview) {
        orgnizedReview[freeReview.reviewerName].push(freeReview);
      } else {
        orgnizedReview[freeReview.reviewerName] = [freeReview];
      }
      setOrgnizedReview(orgnizedReview);
    });
  };

  return (
    <div>
      {Object.entries(orgnizedReview).map(
        ([auther, reviews]: [string, []], index) => {
          return (
            <div>
              <p>{auther}</p>
              {reviews.forEach((rev: FreeReivewData) => {
                console.log("------------------------------");
                console.log(rev.reviewerName);
                console.log(rev.movieTitle);
                console.log("文字数： " + rev.reviewContent.length);
              })}
            </div>
          );
        }
      )}
      <button onClick={() => OrgnizeReviewData()}>aaaaaa</button>
    </div>
  );
};

export default ReviewsResult;
