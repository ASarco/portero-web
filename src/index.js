import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./Routes.js";

import "./firebase";
import "bootswatch/dist/superhero/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <div className="container p-4">
      <div className="row">
        <Routes />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
