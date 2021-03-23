import * as React from "react";
import * as ReactDOM from "react-dom";
import { SubComponent } from "./components/subComponent";

ReactDOM.render(
  <React.StrictMode>
    <SubComponent name="My Counter for TypeScript"></SubComponent>
  </React.StrictMode>,
  document.getElementById("root")
);
