import React, { useState, useEffect } from 'react'
import { Button, List, Card, Modal, message } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { createDay, deleteDay, getDayToolboxAll, getLearningStandard } from '../../../Utils/requests'

import './DayEditor.less'
import Form from 'antd/lib/form/Form';


export default function ContentCreator(props) {
    const [visible, setVisible] = useState(false);
    const [days, setDay] = useState([]);
    const linkBtn = props.linkBtn;
    const [newDay, setNewDay] = useState();
    const learningStandardId = props.learningStandardId
    const learningStandardName = props.learningStandardName
    

    const handleCancel = () => {
        setVisible(false)
    };


    const showModal = () => {
        console.log("got days", props.days)
        setDay([...props.days])
        console.log("set days", days)
        setVisible(true)
    };


    const addBasicDay = (day) => {
        const res = createDay(day, learningStandardId)
        res.then(function (a) {
            //console.log(res1)
            let res1 = getLearningStandard(learningStandardId)
            res1.then((result) => {
                console.log("update the days")
                setDay([...result.data.days])
            })
            
        })
    }

    const removeBasicDay = (currDay) => {
        alert("Deleting ", currDay.name)
        // if (days.length === 1) {
        //     setDay([])
        // } else {
        //     const currIndex = days.indexOf(currDay)
        //     // console.log(days)
        //     // console.log(currIndex)
        //     // console.log(currDay)
        //     if (currIndex === 0) {
        //         let pos = 0
        //         setDay(days.forEach(currDay => {
        //             if (currIndex === 0 && pos === 0) {
        //                 currDay.day = -1
        //             } else {
        //                 currDay.day -= 1
        //             }
        //             pos++;
        //         }))
        //         setDay(days.filter((e) => (e.day !== -1)))
        //     } else {
        //         let pos = 0
        //         setDay(days.forEach(currDay => {
        //             if (pos > currIndex) {
        //                 currDay.day -= 1
        //             } else if (pos === currIndex) {
        //                 currDay.day = -1
        //             }
        //             pos++;
        //         }))
        //         setDay(days.filter((e) => (e.day !== -1)))
        //     }
        // }
        const res = deleteDay(currDay.id)
        res.then(function (a) {
            let res1 = getLearningStandard(learningStandardId)
            res1.then((result) => {
                console.log("update the days")
                setDay([...result.data.days])
            })
        })
    }

    const addButtonStyle = {
        background: "#F4F4F5",
        borderRadius: "20px",
        border: "2px solid #5BABDE",

    }
    const handleViewDay = async day => {
        const res = await getDayToolboxAll();
        day.toolbox = res.data.toolbox;

        localStorage.setItem("my-day", JSON.stringify(day));
        props.history.push('/day')
    };
    //figure out how to set these up in the css file colors[] stuff causes problems

    const handleDayChange = (e) => {
        let {value} = e.target
        setNewDay(parseInt(value))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addBasicDay(newDay)
        setNewDay("")
    }

    return (
        <div>
            {/* {console.log(props)} */}

            <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>View</button>

            <Modal
                title={learningStandardName}
                visible={visible}
                onCancel={handleCancel}
                onOk={handleCancel}
                size="large"

            >
                <div className="list-position">
                    {(days.length > 0) ?
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={days}
                            renderItem={item => (
                                <List.Item >
                                        <Card id="card-day" key={item.id} title={"Day " + item.number } hoverable="true"
                                             onClick={() => handleViewDay(item)} />
                                        <span className="delete-btn" onClick={() => removeBasicDay(item)}>&times;</span>
                                </List.Item>
                            )}
                        /> : null}
                    <div>
                    <form onSubmit={handleSubmit}>
                        <legend>Add Day</legend>
                        <label>
                        Number:  
                        <input type="text" value={newDay} onChange={handleDayChange} />
                        </label>
                        <input type="submit" value="Add" />
                    </form>
                        {/* <Button style={addButtonStyle} onClick={addBasicDay} size="default" icon={<PlusOutlined/>}/> */}
                    </div>
                </div>
{/* 
                <div id="btn-container" className='flex space-between'>
                    {days ? days.map(day =>
                            <div>
                                <button key={day.id} onClick={() => handleViewDay(day)}>{`View Day ${day.day}`}</button>
                                <span className="delete-btn" onClick={() => removeBasicDay(day)}>&times;</span>
                            </div>
                        )
                        : null}
                </div> */}


            </Modal></div>


    )

}