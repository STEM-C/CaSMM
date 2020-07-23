import React, { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import PrivateRoute from './Utils/PrivateRoute';

import Home from "./views/Home/Home"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import Student from "./views/Student/Student"
import NotFound from "./views/NotFound"
import StudentLogin from "./views/StudentLogin/StudentLogin";
import Sandbox from "./views/Sandbox/Sandbox"
import Roster from "./views/Roster/Roster";
import {removeUserSession} from "./Utils/AuthRequests";
import Activity from "./views/Activity/Activity";
import ActivityCatalogue from "./views/ActivityCatalogue/ActivityCatalogue";

const App = () => {
    const [selectedActivity, setSelectedActivity] = useState('');
    let history = useHistory();
    const handleLogout = () => {
        removeUserSession();
        history.push('/');
    };

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={() => <Home history={history} />}/>
                <Route exact path={"/login"} render={() => <StudentLogin history={history} />}/>
                <PrivateRoute exact path={"/dashboard"} render={() => <Dashboard history={history} handleLogout={handleLogout}/>}/>
                <PrivateRoute exact path={"/student"} render={() => <Student history={history} selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity}/> } />
                <Route path={"/workspace"} render={() => <Workspace selectedActivity={selectedActivity} history={history} handleLogout={handleLogout}/>}/>
                <Route path={"/sandbox"} render={() => <Sandbox history={history}/>} />
                <PrivateRoute exact path={"/roster/:id"} render={() => <Roster history={history} handleLogout={handleLogout}/>}/>
                <PrivateRoute exact path={"/activity"} render={() => <Activity selectedActivity={selectedActivity} history={history} handleLogout={handleLogout}/> } />
                <PrivateRoute exact path={"/catalogue"} render={() => <ActivityCatalogue setSelectedActivity={setSelectedActivity} history={history} handleLogout={handleLogout}/> } />
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App