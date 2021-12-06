import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';

import Home from './views/Home/Home';
import About from './views/About/About';
import Workspace from './views/Workspace/Workspace';
import Dashboard from './views/Dashboard/Dashboard';
import Student from './views/Student/Student';
import NotFound from './views/NotFound';
// import NotChrome from './views/NotChrome'
import StudentLogin from './views/StudentLogin/StudentLogin';
import Sandbox from './views/Sandbox/Sandbox';
import Day from './views/Day/Day';
import Classroom from './views/Classroom/Classroom';
import TeacherLogin from './views/TeacherLogin/TeacherLogin';
import ContentCreator from './views/ContentCreator/ContentCreator';
import UnitCreator from './views/ContentCreator/UnitCreator/UnitCreator';
import UploadBlocks from './views/UploadBlocks/UploadBlocks';
import ForgetPassword from './views/TeacherLogin/ForgetPassword';
import ResetPassword from './views/TeacherLogin/ResetPassword';
import BugReport from './views/BugReport/BugReport'
import Report from './views/Researcher/Report';
import DailyReport from './views/Researcher/DailyReport';
import DailyReportView from './views/Researcher/DailyReportView';
import GroupReport from './views/Researcher/GroupReport';
import Replay from './views/Replay/Replay';

const App = () => {
  let history = useHistory();
  // const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // if(!isChrome){
  //     return <Route component={NotChrome}></Route>
  // }
  return (
    <div>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/about'>
          <About />
        </Route>
        <Route exact path='/teacherlogin'>
          <TeacherLogin history={history} />
        </Route>
        <Route exact path='/forgot-password'>
          <ForgetPassword />
        </Route>
        <Route exact path='/reset-password'>
          <ResetPassword />
        </Route>
        <Route exact path='/login'>
          <StudentLogin history={history} />
        </Route>
        <Route exact path='/replay/:saveID'>
          <Replay />
        </Route>
        <PrivateRoute
          exact
          path='/report'
          render={() => <Report history={history} />}
        />
        <Route exact path='/daylevel'>
          <DailyReport />
        </Route>
        <Route exact path='/daylevel/:id'>
          <DailyReportView />
        </Route>
        <Route exact path='/group-report'>
          <GroupReport />
        </Route>
        <PrivateRoute
          exact
          path='/dashboard'
          render={() => <Dashboard history={history} />}
        />
        {/* <PrivateRoute
          exact
          path='/researcherdashboard'
          render={() => <Dashboard history={history} />}
        /> */}
        <PrivateRoute
          exact
          path='/student'
          render={() => <Student history={history} />}
        />
        <Route path='/workspace'>
          <Workspace history={history} />
        </Route>
        <Route path='/sandbox'>
          <Sandbox history={history} />
        </Route>
        <PrivateRoute
          exact
          path='/day'
          render={() => <Day history={history} />}
        />
        <PrivateRoute
          path='/classroom/:id'
          render={() => <Classroom history={history} />}
        />
        <Route exact path='/ccdashboard'>
          <ContentCreator history={history} />
        </Route>
        <Route exact path='/unitcreator'>
          <UnitCreator history={history} />
        </Route>
        <Route exact path='/addblocks'>
          <UploadBlocks history={history} />
        </Route>
        <Route exact path='/bugreport'>
          <BugReport history={history} />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
