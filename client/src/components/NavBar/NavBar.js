import React from 'react';
import './NavBar.less';
import config from './NavBarConfig.json';
import Logo from '../../assets/casmm_logo.png';
import { Link, useHistory } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { removeUserSession } from '../../Utils/AuthRequests';
import { useGlobalState } from '../../Utils/userState';

export default function NavBar() {
  const [value] = useGlobalState('currUser');
  let currentRoute = window.location.pathname;
  let history = useHistory();
  let routes = config.routes;

  const handleLogout = () => {
    removeUserSession();
    history.push('/');
  };

  const handleRouteChange = (route) => {
    history.push(route);
  };

  const shouldShowRoute = (route) => {
    if (currentRoute === routes[route]) return false;
    return config.users[value.role].includes(route);
  };

  const menu = (
    <Menu>
      {shouldShowRoute('Home') ? (
        <Menu.Item key='0' onClick={() => handleRouteChange(routes.Home)}>
          <i className='fa fa-home' />
          &nbsp; Home
        </Menu.Item>
      ) : null}
      {shouldShowRoute('Dashboard') ? (
        <Menu.Item key='1' onClick={() => handleRouteChange(routes.Dashboard)}>
          <i className='fa fa-home' />
          &nbsp; Dashboard
        </Menu.Item>
      ) : null}
      {shouldShowRoute('ContentCreatorDashboard') ? (
        <Menu.Item
          key='1'
          onClick={() => handleRouteChange(routes.ContentCreatorDashboard)}
        >
          <i className='fa fa-home' />
          &nbsp; Dashboard
        </Menu.Item>
      ) : null}
      {shouldShowRoute('ResearcherDashboard') ? (
        <Menu.Item
          key='1'
          onClick={() => handleRouteChange(routes.ResearcherDashboard)}
        >
          <i className='fa fa-home' />
          &nbsp; Dashboard
        </Menu.Item>
      ) : null}
      {shouldShowRoute('Sandbox') ? (
        <Menu.Item
          key='1'
          onClick={() => {
            localStorage.removeItem('sandbox-day');
            handleRouteChange(routes.Sandbox);
          }}
        >
          <i className='fa fa-window-maximize' />
          &nbsp; Sandbox
        </Menu.Item>
      ) : null}
      {shouldShowRoute('TeacherLogin') ? (
        <Menu.Item
          key='2'
          onClick={() => handleRouteChange(routes.TeacherLogin)}
        >
          <i className='fa fa-sign-in-alt' />
          &nbsp; User Login
        </Menu.Item>
      ) : null}
      {shouldShowRoute('About') ? (
        <Menu.Item key='3' onClick={() => handleRouteChange(routes.About)}>
          <i className='fa fa-info-circle' />
          &nbsp; About
        </Menu.Item>
      ) : null}
      {shouldShowRoute('BugReport') ? (
        <Menu.Item key='2' onClick={() => handleRouteChange(routes.BugReport)}>
          <i className='fa fa-calendar-times' />
          &nbsp; Report a Bug
        </Menu.Item>
      ) : null}
      {shouldShowRoute('SignOut') ? (
        <Menu.Item key='3' onClick={() => handleLogout()}>
          <i className='fa fa-sign-out-alt' />
          &nbsp; Sign Out
        </Menu.Item>
      ) : null}
    </Menu>
  );

  return (
    <span id='navBar'>
      <Link
        id='link'
        to={
          value.role === 'ContentCreator'
            ? '/ccdashboard'
            : value.role === 'Mentor'
            ? '/dashboard'
            : value.role === 'Student'
            ? '/student'
            : value.role === 'Researcher'
            ? '/report'
            : '/'
        }
      >
        <img src={Logo} id='casmm-logo' alt='logo' />
      </Link>
      <div id='dropdown-menu'>
        <Dropdown overlay={menu} trigger={['click']}>
          <button
            className='ant-dropdown-link'
            onClick={(e) => e.preventDefault()}
          >
            {value.name ? value.name : 'Menu'} <DownOutlined />
          </button>
        </Dropdown>
      </div>
    </span>
  );
}
