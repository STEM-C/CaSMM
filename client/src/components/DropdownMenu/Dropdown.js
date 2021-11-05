import React from 'react';
import './Dropdown.less'
import Logo from "../../assets/casmm_logo.png";
import { Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';


export default function Dropdown(props) {

    const menu =
        <Menu>
            <Menu.Item>
                Teacher 1
            </Menu.Item>
            <Menu.Item>
                Teacher 2
            </Menu.Item>

        </Menu>

    return (
        <span id="dropdown">
            <div id="dropdown-menu">
                <Dropdown overlay={menu}>
                    <button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        Teacher Name <DownOutlined/>
                    </button>
                </Dropdown>
            </div>
        </span>
    )
}
