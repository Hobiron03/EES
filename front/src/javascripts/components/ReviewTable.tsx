import * as React from "React";
import { useState, useEffect, useContext } from "react";
import Review from "./Review";
import CoordinateArea from "./CoordinateArea";
import firebase from "../../../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import AppContext from "../contexts/AppContext";
import DTW from "dtw";

interface ReivewData {
  dynamicFaceIcon: string;
  title: string;
  canvasImage: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
  emotions: Array<string>;
}

let dtw = new DTW();

const ReviewTable = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(AppContext);

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
    const snapshot = await firebase.firestore().collection("reviews").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const OpenReviewModal = (review) => {
    setReview(review);
    setIsOpenReviewModal(true);
  };

  const CloseReviewModal = () => {
    setIsOpenReviewModal(false);
  };

  const ReivewContent = () => {
    return (
      <div>
        <div className="c-modal_content_inner__header">
          <div className="c-modal_content_inner__header__faceicon">
            <img src={review.dynamicFaceIcon} alt="" />
          </div>
          <div className="c-modal_content_inner__header__title">
            <h2>{review.title}</h2>
          </div>
        </div>

        {review.EmotionalFaceIcon.map((faceIcon, index) => {
          return (
            <div className="c-modal_content_inner__content">
              <div className="c-modal_content_inner__content__columns">
                <div className="c-modal_content_inner__content__columns__faceicon">
                  <img src={faceIcon} alt="" />
                </div>
                <div className="c-modal_content_inner__content__columns__comment">
                  <p>{review.comments[index]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ModalBody = <div className={classes.paper}>{ReivewContent()}</div>;

  const ReivewModal = () => {
    if (isOpenReviewModal) {
      return (
        <Modal
          open={isOpenReviewModal}
          onClose={CloseReviewModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {ModalBody}
        </Modal>
      );
    }
  };

  return (
    <div className={classes.reviewTable}>
      {state.filterFaceIcon}
      {reviews.map((review, index) => {
        if (
          review.emotions.includes(state.filterEmotion) ||
          state.filterEmotion === ""
        ) {
          if (state.filterDTW.timeSeriesDataX.length === 0) {
            return (
              <div key={index}>
                <Review
                  title={review.title}
                  faceIconURL={review.canvasImage}
                  onClick={() => OpenReviewModal(review)}
                ></Review>
              </div>
            );
          } else {
            let costX = dtw.compute(
              state.filterDTW.timeSeriesDataX,
              review.dataX
            );
            let costY = dtw.compute(
              state.filterDTW.timeSeriesDataY,
              review.dataY
            );
            console.log(costX + costY);
            if (costX + costY <= 90000) {
              return (
                <div key={index}>
                  <Review
                    title={review.title}
                    faceIconURL={review.canvasImage}
                    onClick={() => OpenReviewModal(review)}
                  ></Review>
                </div>
              );
            }
          }
        }
      })}
      {ReivewModal()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  reviewTable: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    width: 1300,
  },
}));

export default ReviewTable;
