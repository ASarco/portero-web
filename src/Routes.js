import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Porteros from "./components/Porteros";
import Levels from "./components/Levels";
import Units from "./components/Units";
import Login from "./Login"
import {AuthProvider} from "./Auth";
import PrivateRoute from "./PrivateRoute";

function Routes() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <PrivateRoute exact path="/" component={Porteros}/>
                    <PrivateRoute exact path="/portero/:id" component={Levels}/>
                    <PrivateRoute
                        exact
                        path="/portero/:porteroId/level/:levelId"
                        component={Units}
                    />
                    <Route exact path="/login" component={Login}/>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default Routes;
