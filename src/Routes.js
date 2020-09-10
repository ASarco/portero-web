import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Porteros from "./components/Porteros";
import Levels from "./components/Levels";
import Units from "./components/Units";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Porteros} />
        <Route exact path="/portero/:id" component={Levels} />
        <Route
          exact
          path="/portero/:porteroId/level/:levelId"
          component={Units}
        />
      </Switch>
    </Router>
  );
}

export default Routes;
