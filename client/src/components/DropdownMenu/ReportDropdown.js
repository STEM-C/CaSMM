import React from 'react';
import './ReportDropdown.less';
import { Select } from 'antd';
const { Option } = Select;


function handleChange(value) {
    console.log(`selected ${value}`);
}

export default function ReportDropdown({menuName, menuItems}) {

    const menus = Object.entries(menuItems).map((key) => {
        console.log("key :", key)
        return (
            <Option className="report-menu-item" value={`${key[1]}`}>
                {`${key[1]}`}
            </Option>
        )
    })

    return (
        <div>
            <Select defaultValue={menuName} onChange={handleChange}>
                {menus}
            </Select>
        </div>
    )
}
