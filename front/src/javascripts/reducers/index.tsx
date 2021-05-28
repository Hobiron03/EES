import { combineReducers } from "redux";
import filterEmotion from "./filterByEmotion";
import filterFaceIcon from "./filterByFaceIcon";
import filterDTW from "./filterByDTW";

export default combineReducers({
  filterEmotion,
  filterFaceIcon,
  filterDTW,
});
