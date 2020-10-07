import React,{useState} from 'react'

import {Modal} from 'antd';

import './viewDayModal.less'

export default function ViewDayModal(props){

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



    return(
        <div>
        <button onClick={showModal} id={'link-btn'} >View</button>
        <Modal
        title="hello"
        visible={visible}
        onCancel={handleCancel}
        size="large"
    >
                <div id="btn-container" className='flex space-between'>
                    {days ? days.map(day =>
                            <button key={day}>{`View Day ${day.day}`}</button>
                        )
                        : null}
                </div>
       
        </Modal>
        </div>
    )
}