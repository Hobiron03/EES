import { FILTER_BY_EMOTION } from "../actions/index";

interface filterColor {
  filterColor: string;
}

const filterEmotion = (state = "", action) => {
  switch (action.type) {
    case FILTER_BY_EMOTION:
      return action.filterEmotion;
    default:
      return state;
  }
};

export default filterEmotion;
