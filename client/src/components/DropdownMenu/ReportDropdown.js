import React from 'react';
import './ReportDropdown.less';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';


export default function ReportDropdown({menuName, manuItems}) {

    const menus = Object.entries(manuItems).map((key) => {
        return (
            <Menu.item key={key[0]} icon={<UserOutlined/>}>
                {key[1].name}
            </Menu.item>
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
