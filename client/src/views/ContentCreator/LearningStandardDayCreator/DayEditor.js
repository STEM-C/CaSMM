import React, { useState } from 'react'
import { Button, List, Card, Modal, Form, Input } from 'antd'
import { createDay, deleteDay, getDayToolboxAll, getLearningStandard } from '../../../Utils/requests'

import './DayEditor.less'
// import Form from 'antd/lib/form/Form';


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


    const addBasicDay = () => {
        const res = createDay(newDay, learningStandardId)
        res.then(function (a) {
            //console.log(res1)
            let res1 = getLearningStandard(learningStandardId)
            res1.then((result) => {
                console.log("update the days")
                setDay([...result.data.days])
            })
            
        })
        setNewDay()
    }

    const removeBasicDay = (currDay) => {
        alert("Deleting ", currDay.name)

        const res = deleteDay(currDay.id)
        res.then(function (a) {
            let res1 = getLearningStandard(learningStandardId)
            res1.then((result) => {
                console.log("update the days")
                setDay([...result.data.days])
            })
        })
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

    return (
        <div>
            {/* {console.log(props)} */}

            <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>{learningStandardName}</button>

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

                    <Form id="add-day"
                        // labelCol={{
                        // span: 4
                        // }}
                        wrapperCol={{
                            span: 14
                        }}
                        layout="horizontal"
                        size="default">
                        <b>Add Day</b>
                        <Form.Item label="Number">
                            <Input onChange={handleDayChange} value={newDay} />
                        </Form.Item >
                        <Button onClick={addBasicDay} type="primary">
                                Add
                        </Button>
                    </Form>
                    {/* <form id="add-day" onSubmit={handleSubmit}>
                        <legend>Add Day</legend>
                        <label>
                        Number:  
                        <input type="text" value={newDay} onChange={handleDayChange} />
                        </label>
                        <input type="submit" value="Add" />
                    </form> */}
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