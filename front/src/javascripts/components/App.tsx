import * as React from "react";
import { useReducer, useState } from "react";
import AppContext from "../contexts/AppContext";
import reducer from "../reducers";
import { FILTER_BY_EMOTION, FILTER_BY_FACEICON } from "../actions";

import ReviewTable from "./ReviewTable";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import CoordinateArea from "./CoordinateArea";
import DTW from "dtw";

const App = () => {
  const initialState = {
    filterEmotion: "",
    filterFaceIcon: [],
    filterDTW: { timeSeriesDataX: [], timeSeriesDataY: [] },
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();

  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

  const HandleFilterByEmotionButtonOnClick = (emotion) => {
    dispatch({
      type: FILTER_BY_EMOTION,
      filterEmotion: emotion,
    });
  };

  const HandleFilterByFaceIconOkButtonClick = () => {
    console.log(state.filterDTW.timeSeriesDataX);
    CloseReviewModal();
  };

  const OpenReviewModal = () => {
    setIsOpenReviewModal(true);
  };

  const CloseReviewModal = () => {
    setIsOpenReviewModal(false);
  };

  const ReivewContent = () => {
    return (
      <div>
        <CoordinateArea></CoordinateArea>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => HandleFilterByFaceIconOkButtonClick()}
        >
          オッケー
        </Button>
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
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <div className="ReivewArea">
          <h3>{"商品やサービス"} レビュー一覧</h3>
          <div className="filterButtons">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => HandleFilterByEmotionButtonOnClick("Angry")}
            >
              怒り
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => HandleFilterByEmotionButtonOnClick("Sad")}
            >
              悲しみ
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => HandleFilterByEmotionButtonOnClick("Happy")}
            >
              喜び
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => HandleFilterByEmotionButtonOnClick("Pleasure")}
            >
              楽しみ
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => OpenReviewModal()}
            >
              顔検索
            </Button>
          </div>
          {ReivewModal()}

          <ReviewTable></ReviewTable>
        </div>
      </div>
    </AppContext.Provider>
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
}));

export default App;
