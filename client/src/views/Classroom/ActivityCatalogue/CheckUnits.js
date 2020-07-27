import {Checkbox} from 'antd';
import React, {useState} from "react";

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'];

export default function CheckUnits() {
    const [checkedList, setCheckedList] = useState(plainOptions);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(true);


    const onChange = checked => {
        setCheckedList(checked);
        setIndeterminate(!!checked.length && checked.length < plainOptions.length);
        setCheckAll(checked.length === plainOptions.length)
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked)
    };

    return (
        <>
            <div className="site-checkbox-all-wrapper">
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >
                    All Units
                </Checkbox>
            </div>
            <br/>
            <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
            />
        </>
    );
}
