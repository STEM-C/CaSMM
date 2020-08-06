import React from 'react';
import './NavBar.less'
import Logo from "../../assets/casmm_logo.png";
import {Link} from "react-router-dom";
import {Menu, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {getUser} from "../../Utils/AuthRequests";

export default function NavBar(props) {
    const {handleLogout, handleHome, handleTeacherLogin, handleLeaveClass, handleSandbox, isMentor} = props;
    const user = getUser();

    const menu = isMentor ? (
        <Menu>
            <Menu.Item key="0">
                <i className="fa fa-user-circle"/>
                &nbsp; Account Info
            </Menu.Item>
            {handleHome ? <Menu.Item key="1" onClick={handleHome}>
                <i className="fa fa-home"/>
                &nbsp; Dashboard
            </Menu.Item> : null}
            <Menu.Item key="2" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"/>
                &nbsp; Sign Out
            </Menu.Item>
        </Menu>
    ) : (
        <Menu>
            {handleHome ? <Menu.Item key="0" onClick={handleHome}>
                <i className="fa fa-home"/>
                &nbsp; Home
            </Menu.Item> : null}
            {handleSandbox ? <Menu.Item key="1" onClick={handleSandbox}>
                <i className="fa fa-window-maximize"/>
                &nbsp; Sandbox
            </Menu.Item> : null}
            {handleTeacherLogin ? <Menu.Item key="2" onClick={handleTeacherLogin}>
                <i className="fa fa-sign-in-alt"/>
                &nbsp; Teacher Login
            </Menu.Item> : null}
            {handleLogout ? <Menu.Item key="3" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"/>
                &nbsp; Sign Out
            </Menu.Item> : null}
        </Menu>
    );

    return (
        <span id="navBar">
            <Link id='link' to={isMentor ? "/dashboard" : "/"}>
                <img src={Logo} id='casmm-logo' alt='logo'/>
            </Link>
            <div id="dropdown-menu">
                <Dropdown overlay={menu} trigger={['click']}>
                    <button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {isMentor ? user.username : "Menu"} <DownOutlined/>
                    </button>
                </Dropdown>
            </div>
        </span>
    )
}
