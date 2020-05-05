import React, {useState} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Workspace from "./views/Workspace"
import Home from "./views/Home"
import NotFound from "./views/NotFound"

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState();

    return(
        <div>
            <Switch>
                <Route exact path={"/Home"} render={(props) => <Home selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity} /> } />
                <Route exact path ="/" >
                    <Redirect to={"/Home"} />
                </Route>
                <Route path={"/Home/:projectId"} component = { Workspace } />
                <Route component={NotFound} />
            </Switch>
        </div>
    )
}

export default App;