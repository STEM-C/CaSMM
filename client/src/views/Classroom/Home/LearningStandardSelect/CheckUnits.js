import {Checkbox} from 'antd';
import React, {useState} from "react";

const CheckboxGroup = Checkbox.Group;

export default function CheckUnits(props) {
    const {plainOptions, checkedList, setCheckedList} = props;
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(true);


    const onChange = checked => {
        setCheckedList(checked.map(value => {
            const option = getOptions(value);
            return {...option}
        }));
        setIndeterminate(!!checked.length && checked.length < plainOptions.length);
        setCheckAll(checked.length === plainOptions.length)
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked)
    };

    const getOptions = (value) => {
        return plainOptions.find(option => option.number === parseInt(value.slice(-1)))
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
                options={plainOptions.map(option => `Unit ${option.number}`)}
                value={checkedList.map(checked => `Unit ${checked.number}`)}
                onChange={onChange}
            />
        </>
    );
}
