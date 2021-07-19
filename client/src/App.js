import React from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import PrivateRoute from './Utils/PrivateRoute';

import Home from "./views/Home/Home"
import About from "./views/About/About"
import Workspace from "./views/Workspace/Workspace"
import Dashboard from "./views/Dashboard/Dashboard"
import Student from "./views/Student/Student"
import StudentDetail from './views/StudentDetail/StudentDetail'
import NotFound from "./views/NotFound"
import StudentLogin from "./views/StudentLogin/StudentLogin";
import Sandbox from "./views/Sandbox/Sandbox"
import Day from "./views/Day/Day";
import Classroom from "./views/Classroom/Classroom"
import TeacherLogin from "./views/TeacherLogin/TeacherLogin"
import ContentCreator from './views/ContentCreator/ContentCreator'
import UnitCreator from './views/ContentCreator/UnitCreator/UnitCreator'
import UploadBlocks from './views/UploadBlocks/UploadBlocks'
import Replay from './components/Replay/Replay';

const App = () => {
    let history = useHistory();

    return (
        <div>
            <Switch>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/about"}>
                    <About/>
                </Route>
                <Route exact path={"/teacherlogin"}>
                    <TeacherLogin/>
                </Route>
                <Route exact path={"/login"}>
                    <StudentLogin/>
                </Route>
                <PrivateRoute exact path={"/dashboard"} render={() => <Dashboard history={history}/>}/>
                <PrivateRoute exact path={"/student"} render={() => <Student history={history} /> } />
                <Route path={"/workspace"}>
                    <Workspace/>
                </Route>
                <Route path={"/sandbox"}>
                    <Sandbox/>
                </Route>
                <PrivateRoute exact path={"/day"} render={() => <Day history={history} /> } />
                <PrivateRoute path={"/classroom/:id"} render={() => <Classroom history={history} /> } />
                <PrivateRoute path={"/students/:classroomId/:studentId"} render={() => <StudentDetail /> } />
                <Route exact path={"/ccdashboard"}>
                    <ContentCreator/>
                </Route>
                <Route exact path={"/unitcreator"}>
                    <UnitCreator/>
                </Route>
                <Route exact path={"/addblocks"}>
                    <UploadBlocks/>
                </Route>
                <Route exact path={"/replay"}>
                    <Replay/>
                </Route>
                <Route component={NotFound}/>
            </Switch>
        </div>
    )
}

export default App