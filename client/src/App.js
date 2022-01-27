import React from 'react';
import { Route, withRouter, Switch, useHistory } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';

import Home from './views/Home/Home';
import About from './views/About/About';
import Dashboard from './views/Mentor/Dashboard/Dashboard';
import Student from './views/Student/Student';
import NotFound from './views/NotFound';
import StudentLogin from './views/StudentLogin/StudentLogin';
import BlocklyPage from './views/BlocklyPage/BlocklyPage';
import Classroom from './views/Mentor/Classroom/Classroom';
import TeacherLogin from './views/TeacherLogin/TeacherLogin';
import ContentCreator from './views/ContentCreator/ContentCreator';
import ForgetPassword from './views/TeacherLogin/ForgetPassword';
import ResetPassword from './views/TeacherLogin/ResetPassword';
import BugReport from './views/BugReport/BugReport';
import Report from './views/Researcher/Report';
import DayLevelReport from './views/Researcher/DayLevelReport';
import DayLevelReportView from './views/Researcher/DayLevelReportView';
import GroupReport from './views/Researcher/GroupReport';
import Replay from './views/Replay/Replay';

const App = () => {
  let history = useHistory();
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
        <PrivateRoute exact path='/daylevel'>
          <DayLevelReport history={history} />
        </PrivateRoute>
        <PrivateRoute exact path='/daylevel/:id'>
          <DayLevelReportView history={history} />
        </PrivateRoute>
        <PrivateRoute exact path='/group-report'>
          <GroupReport history={history} />
        </PrivateRoute>
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
        <PrivateRoute exact path='/workspace'>
          <BlocklyPage history={history} isSandbox={false} />
        </PrivateRoute>
        <Route path='/sandbox'>
          <BlocklyPage history={history} isSandbox={true} />
        </Route>
        <PrivateRoute
          exact
          path='/day'
          render={() => <BlocklyPage history={history} isSandbox={false} />}
        />
        <PrivateRoute
          path='/classroom/:id'
          render={() => <Classroom history={history} />}
        />
        <Route exact path='/ccdashboard'>
          <ContentCreator history={history} />
        </Route>
        <Route exact path='/bugreport'>
          <BugReport history={history} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
