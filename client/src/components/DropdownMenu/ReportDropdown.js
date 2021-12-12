import React from 'react';
import './ReportDropdown.less';
import { Form, Select } from 'antd';
const { Option } = Select;


function handleChange(value) {
    console.log(`selected ${value}`);
}

export default function ReportDropdown({label, menuName, menuItems}) {
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
            <Form.Item label={label}>
                <Select defaultValue={menuName} onChange={handleChange}>
                    {menus}
                </Select>
            </Form.Item>
        </div>
    )
}
