import * as React from "React";
import { useState, useEffect } from "react";
import firebase from "../../../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

interface ReivewData {
  dynamicFaceIcon: string;
  title: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ReviewTable = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<ReivewData>({
    dynamicFaceIcon: "",
    title: "",
    EmotionalFaceIcon: [],
    comments: [],
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
    <div className="review-table">
      {reviews.map((review, index) => {
        return (
          <img
            src={review.dynamicFaceIcon}
            alt=""
            key={index}
            width={100}
            onClick={() => OpenReviewModal(review)}
          />
        );
      })}
      {ReivewModal()}
    </div>
  );
};

export default ReviewTable;
