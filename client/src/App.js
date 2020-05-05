import React, {useState, useEffect} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Workspace from "./views/Workspace/Workspace"
import Home from "./views/Home/Home"
import NotFound from "./views/NotFound"

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState();

    useEffect(() => {
        console.log("Selected activity has changed to: ", selectedActivity);
    }, [selectedActivity])
    return(
        <div>
            <Switch>
                <Route exact path={"/Home"} render={(props) => <Home setSelectedActivity={setSelectedActivity} /> } />
                <Route exact path ="/" >
                    <Redirect to={"/Home"} />
                </Route>
                <Route path={"/Home/:projectId"} render = { (props) => <Workspace selectedActivity={selectedActivity} /> } />
                <Route component={NotFound} />
            </Switch>
        </div>
    )
}

export default App;