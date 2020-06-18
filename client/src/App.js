import React, { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import Login from "./views/Login/Login"
import Home from "./views/Home/Home"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import NotFound from "./views/NotFound"

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState();
    let history = useHistory()

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={(props) => <Home history={history} />}/>
                <Route exact path={"/login"} render={(props) => <Login history={history} />}/>
                <Route exact path={"/dashboard"} render={() => <Dashboard setSelectedActivity={setSelectedActivity} history={history}/>}/>
                <Route path={"/workspace"} render={() => <Workspace selectedActivity={selectedActivity} history={history}/>}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App;