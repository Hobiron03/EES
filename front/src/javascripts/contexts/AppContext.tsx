import { createContext } from "react";

interface IProps {
  state: {
    filterEmotion: any;
    filterFaceIcon: any;
    filterDTW: any;
  };
  dispatch: any;
}

const AppContext = createContext({} as IProps);

export default AppContext;
