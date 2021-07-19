import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import { Modal } from 'antd';
import {CloseOutlined} from '@ant-design/icons'

import './viewDayModal.less'
import { getDayToolboxAll } from "../../../Utils/requests";

export default function ViewDayModal(props) {

    const [visible, setVisible] = useState(false);
    const [days, setDay] = useState([]);

    const showModal = () => {
        setDay([...props.days])
        setVisible(true)
        // console.log(days)
        // console.log(props.days)
    };
    const handleCancel = () => {
        setVisible(false)
    };

    const handleViewDay = async day => {
        const res = await getDayToolboxAll();
        day.toolbox = res.data.toolbox;

        localStorage.setItem("my-day", JSON.stringify(day));
        history.push('/day')
    };

    return (
        <div>
            <button onClick={showModal} id={'link-btn'}>View</button>
            <Modal
                title="hello"
                visible={visible}
                onCancel={handleCancel}
                size="large"
            >
                <div id="btn-container" className='flex space-between'>
                    {days ? days.map(day =>
                            <div>
                                <button key={day.id} onClick={() => handleViewDay(day)}>{`View Day ${day.day}`}</button>
                                
                            </div>
                        )
                        : null}
                </div>

            </Modal>
        </div>
    )
}