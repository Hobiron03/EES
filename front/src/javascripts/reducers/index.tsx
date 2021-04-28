import { combineReducers } from "redux";
import filterEmotion from "./filterByEmotion";
import filterFaceIcon from "./filterByFaceIcon";

export default combineReducers({
  filterEmotion,
  filterFaceIcon,
});
