import { FILTER_BY_FACEICON } from "../actions/index";

interface filterFaceIcon {
  filterFaceIcon: Array<string>;
}

const filterFaceIcon = (state = [], action) => {
  switch (action.type) {
    case FILTER_BY_FACEICON:
      return action.filterFaceIcon;
    default:
      return state;
  }
};

export default filterFaceIcon;
