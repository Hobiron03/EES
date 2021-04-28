import * as React from "react";
import { useReducer } from "react";
import AppContext from "../contexts/AppContext";
import reducer from "../reducers";
import { FILTER_BY_EMOTION } from "../actions";

import ReviewTable from "./ReviewTable";
import Button from "@material-ui/core/Button";
import CoordinateArea from "./CoordinateArea";

const App = () => {
  const initialState = {
    filterEmotion: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const HandleFilterByEmotionButtonOnClick = (emotion) => {
    dispatch({
      type: FILTER_BY_EMOTION,
      filterEmotion: emotion,
    });
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
          </div>
          {state.filterEmotion}
          <CoordinateArea></CoordinateArea>
          <ReviewTable></ReviewTable>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
