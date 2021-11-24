import React from 'react';
import './ReportDropdown.less';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';


export default function ReportDropdown({menuName, menuItems}) {

    const menus = Object.entries(menuItems).map((key) => {
        console.log("key :", key)
        return (
            <Menu.Item key={key[0]}>
                {`${key[1]}`}
            </Menu.Item>
        )
    })
    const menu = () => {
        return (
            <Menu>
                {menus}
            </Menu>
        );
    }

    return (
            <Dropdown overlay={menu}>
                <button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {`${menuName}`} <DownOutlined/>
                </button>
            </Dropdown>
    )
}
