import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Workspace from "./views/Workspace/Workspace"
import Home from "./views/Home/Home"
import NotFound from "./views/NotFound"

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState()

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={(props) => <Home setSelectedActivity={setSelectedActivity}/>}/>
                <Route path={"/workspace"} render={(props) => <Workspace selectedActivity={selectedActivity}/>}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App;