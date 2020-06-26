import React, { useEffect, useState } from "react"
import { getTopics, getSchools, getClassrooms } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import { Table } from 'antd';
import './Dashboard.less'

import Header from '../../components/Header.js'

export default function Dashboard(props) {
    const [activities, setActivities] = useState([])
    const [tableData, setTableData] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const user = getUser();

    const columns = [
        {
            title: 'Classroom',
            dataIndex: 'classroom',
            key: 'classroom'
        },
        {
            title: 'Session Name',
            dataIndex: 'session',
            key: 'session'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Join Code',
            dataIndex: 'code',
            key: 'code'
        }
    ];

    useEffect(() => {

        getTopics(sessionStorage.getItem('token')).then(topics => {
            // temporary - put all the activities into one array for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setActivities(activities)
        })
        getSchools(sessionStorage.getItem('token')).then(schoolArray => {
            let data = [];
            schoolArray.map( school => {
                getClassrooms(school.id, sessionStorage.getItem('token')).then(classroomArray => {
                    classroomArray.map( classroom => {
                        classroom.sessions.map( session => {
                            data.push({
                                key: session.code,
                                classroom: classroom.name,
                                session: session.name,
                                description: session.description,
                                code: session.code
                            })
                        })
                    });
                    setTableData(data)
                })
            })
        })
    }, [])

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    }

    return (
        <div id={"container"}>
            <Header user={user.username} handleLogout={handleLogout}/>
            <div id='table-container'>
                <Table rowSelection={selectedRowKeys} columns={columns} dataSource={tableData}/>
            </div>
        </div>
    )
}