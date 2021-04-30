import { FILTER_BY_DTW } from "../actions/index";

interface filterDTW {
  timeSeriesDataX: Array<number>;
  timeSeriesDataY: Array<number>;
}

interface filterDTWAction {
  type: string;
  timeSeriesData: filterDTW;
}

const filterDTW = (
  state: filterDTW = { timeSeriesDataX: [], timeSeriesDataY: [] },
  action: filterDTWAction
) => {
  switch (action.type) {
    case FILTER_BY_DTW:
      return action.timeSeriesData;
    default:
      return state;
  }
};

export default filterDTW;
