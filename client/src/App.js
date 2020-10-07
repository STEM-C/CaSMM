import React from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import PrivateRoute from './Utils/PrivateRoute';

import Home from "./views/Home/Home"
import About from "./views/About/About"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import Student from "./views/Student/Student"
import NotFound from "./views/NotFound"
import StudentLogin from "./views/StudentLogin/StudentLogin";
import Sandbox from "./views/Sandbox/Sandbox"
import Day from "./views/Day/Day";
import Classroom from "./views/Classroom/Classroom"
import TeacherLogin from "./views/TeacherLogin/TeacherLogin"
import ContentCreator from './views/ContentCreator/ContentCreator'
import UnitCreator from './views/ContentCreator/UnitCreator/UnitCreator'


const App = () => {
    let history = useHistory();

    return (
        <div>
            <Switch>
                <Route exact path={"/"} render={() => <Home history={history}/>}/>
                <Route exact path={"/about"} render={() => <About history={history}/>}/>
                <Route exact path={"/teacherlogin"} render={() => <TeacherLogin history={history}/>}/>
                <Route exact path={"/login"} render={() => <StudentLogin history={history} />}/>
                <PrivateRoute exact path={"/dashboard"} render={() => <Dashboard history={history}/>}/>
                <PrivateRoute exact path={"/student"} render={() => <Student history={history} /> } />
                <Route path={"/workspace"} render={() => <Workspace history={history} />}/>
                <Route path={"/sandbox"} render={() => <Sandbox history={history}/>} />
                <PrivateRoute exact path={"/day"} render={() => <Day history={history} /> } />
                <PrivateRoute path={"/classroom/:id"} render={() => <Classroom history={history} /> } />
                <Route exact path={"/contentcreator"} render={() => <ContentCreator history={history} />}/>
                <Route exact path={"/unitcreator"} render={() => <UnitCreator history={history} />}/>
               
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App