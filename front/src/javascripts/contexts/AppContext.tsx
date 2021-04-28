import { createContext } from "react";

interface IProps {
  state: {
    filterEmotion: any;
  };
  dispatch: ({ type }: { type: string }) => void;
}

const AppContext = createContext({} as IProps);

export default AppContext;
