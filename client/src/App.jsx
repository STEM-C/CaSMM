import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import About from './views/About/About';
import BlocklyPage from './views/BlocklyPage/BlocklyPage';
import BugReport from './views/BugReport/BugReport';
import ContentCreator from './views/ContentCreator/ContentCreator';
import Home from './views/Home/Home';
import Classroom from './views/Mentor/Classroom/Classroom';
import Dashboard from './views/Mentor/Dashboard/Dashboard';
import NotFound from './views/NotFound';
import Replay from './views/Replay/Replay';
import DayLevelReport from './views/Researcher/DayLevelReport';
import DayLevelReportView from './views/Researcher/DayLevelReportView';
import GroupReport from './views/Researcher/GroupReport';
import Report from './views/Researcher/Report';
import Student from './views/Student/Student';
import StudentLogin from './views/StudentLogin/StudentLogin';
import CreateAccount from './views/TeacherLogin/CreateAccount'; 
import ForgetPassword from './views/TeacherLogin/ForgetPassword';
import ResetPassword from './views/TeacherLogin/ResetPassword';
import TeacherLogin from './views/TeacherLogin/TeacherLogin';
import Sorry from './views/TeacherLogin/Sorry';
import ConfirmEmail from './views/TeacherLogin/ConfirmEmail';
import { getConfirmed } from './Utils/AuthRequests';
import MentorRegister from './views/Mentor/Dashboard/MentorRegister';
import AddMentor from './views/Mentor/Dashboard/AddMentor';
import CodeViz from './views/Researcher/viz';
import CodeDayz from './views/Researcher/dayz';
import Form from './views/Student/form';

export function confirmRedirect () {
  const navigate = useNavigate();
  getConfirmed()
  .then(value => {
    if (!value){
      navigate('/sorry');
    };
  });
}


const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/teacherlogin' element={<TeacherLogin />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/create-account' element={<CreateAccount />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/login' element={<StudentLogin />} />
        <Route path='/replay/:saveID' element={<Replay />} />
        <Route path='/confirm-email' element = {<ConfirmEmail />} />
        <Route path='/sandbox' element={<BlocklyPage isSandbox={true} />} />
        <Route path='/sorry' element={<Sorry />} />
        <Route path='/mentor-register' element={<PrivateRoute>
          <MentorRegister /></PrivateRoute>} />
        <Route path='/add-mentor' element={<PrivateRoute>
          <AddMentor /></PrivateRoute>} />
        <Route path='/viz' element={<PrivateRoute>
          <CodeViz /></PrivateRoute>} />
        <Route path='/dayz' element={<PrivateRoute>
          <CodeDayz /></PrivateRoute>} />
        <Route
          path='/report'
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        />
        <Route
          path='/daylevel'
          element={
            <PrivateRoute>
              <DayLevelReport />
            </PrivateRoute>
          }
        />
        <Route
          path='/daylevel/:id'
          element={
            <PrivateRoute>
              <DayLevelReportView />
            </PrivateRoute>
          }
        />
        <Route
          path='/group-report'
          element={
            <PrivateRoute>
              <GroupReport />
            </PrivateRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/student'
          element={
            <PrivateRoute>
              <Student />
            </PrivateRoute>
          }
        />
        <Route 
          path='/form'
          element={<PrivateRoute><Form/></PrivateRoute>}
          />

        <Route
          path='/classroom/:id'
          element={
            <PrivateRoute>
              <Classroom />
            </PrivateRoute>
          }
        />
        <Route
          path='/workspace'
          element={
            <PrivateRoute>
              <BlocklyPage isSandbox={false} />
            </PrivateRoute>
          }
        />
        <Route
          path='/day'
          element={
            <PrivateRoute>
              <BlocklyPage isSandbox={false} />
            </PrivateRoute>
          }
        />
        <Route
          path='/ccdashboard'
          element={
            <PrivateRoute>
              <ContentCreator />
            </PrivateRoute>
          }
        />
        <Route path='/bugreport' element={<BugReport />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </div>
  );
};

export default App;
