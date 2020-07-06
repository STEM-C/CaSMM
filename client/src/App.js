import React, { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import PrivateRoute from './Utils/PrivateRoute';

import Home from "./views/Home/Home"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import Student from "./views/Student/Student"
import NotFound from "./views/NotFound"
import StudentLogin from "./views/StudentLogin/StudentLogin";

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState('');
    let history = useHistory()

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={() => <Home history={history} />}/>
                <Route exact path={"/login"} render={() => <StudentLogin history={history} />}/>
                <PrivateRoute exact path={"/dashboard"} render={() => <Dashboard history={history}/>}/>
                <PrivateRoute exact path={"/student"} render={() => <Student history={history} selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity}/> } />
                <Route path={"/workspace"} render={() => <Workspace selectedActivity={selectedActivity} history={history}/>}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App