import React from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import PrivateRoute from './Utils/PrivateRoute';

import Home from "./views/Home/Home"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import Student from "./views/Student/Student"
import NotFound from "./views/NotFound"
import StudentLogin from "./views/StudentLogin/StudentLogin";
import Sandbox from "./views/Sandbox/Sandbox"
import {removeUserSession} from "./Utils/AuthRequests";
import Day from "./views/Day/Day";
import Classroom from "./views/Classroom/Classroom"

const App = () => {
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
                <PrivateRoute exact path={"/student"} render={() => <Student history={history}/> } />
                <Route path={"/workspace"} render={() => <Workspace history={history} handleLogout={handleLogout}/>}/>
                <Route path={"/sandbox"} render={() => <Sandbox history={history}/>} />
                <PrivateRoute exact path={"/day"} render={() => <Day history={history} handleLogout={handleLogout}/> } />
                <PrivateRoute path={"/classroom/:id"} render={() => <Classroom history={history} handleLogout={handleLogout}/> } />
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App