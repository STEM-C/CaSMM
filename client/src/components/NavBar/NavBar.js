import React from 'react';
import './NavBar.less'
import Logo from "../../assets/casmm_logo.png";
import {Link} from "react-router-dom";
import {Menu, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {getUser} from "../../Utils/AuthRequests";

export default function NavBar(props) {
    const {handleLogout} = props;
    const user = getUser();

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <i className="fa fa-user-circle"/>
                &nbsp; Account Info
            </Menu.Item>
            <Menu.Item key="1" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"/>
                &nbsp; Sign Out
            </Menu.Item>
        </Menu>
    );

    return (
        <span id="navBar">
            <Link id='link' to={"/dashboard"}>
                <img src={Logo} id='casmm-logo' alt='logo'/>
            </Link>
            <div id="dropdown-menu">
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {user.username} <DownOutlined/>
                    </a>
                </Dropdown>
            </div>
        </span>
    )
}
