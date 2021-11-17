import React from 'react';
import './ReportDropdown.less';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';


export default function ReportDropdown() {

    const menu = (
        <Menu>
            <Menu.Item>
                Teacher 1
            </Menu.Item>
            <Menu.Item>
                Teacher 2
            </Menu.Item>

        </Menu>
    );

    return (
            <Dropdown overlay={menu}>
                <button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    Teacher Name <DownOutlined/>
                </button>
            </Dropdown>
    )
}
