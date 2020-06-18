import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import Login from "./views/Login/Login"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import NotFound from "./views/NotFound"

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState();

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={(props) => <Login />}/>
                <Route exact path={"/activities"} render={() => <Dashboard setSelectedActivity={setSelectedActivity}/>}/>
                <Route path={"/workspace"} render={() => <Workspace selectedActivity={selectedActivity}/>}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App;