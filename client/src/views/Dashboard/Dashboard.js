import React, { useEffect, useState } from "react"
import { getSchools, getClassrooms } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import { Table, Switch } from 'antd';
import './Dashboard.less'

import Header from '../../components/Header.js'

export default function Dashboard(props) {
    const [tableData, setTableData] = useState([])
    const user = getUser();

    function onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    const columns = [
        {
            title: 'Classroom',
            dataIndex: 'classroom',
            key: 'classroom',
            align: 'left'
        },
        {
            title: 'Session Name',
            dataIndex: 'session',
            key: 'session',
            align: 'right'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'right'
        },
        {
            title: 'Join Code',
            dataIndex: 'code',
            key: 'code',
            align: 'right'
        },
        {
            title: 'Enable/Disable Session',
            dataIndex: 'active',
            key: 'active',
            align: 'right',
            render: (e) => (< Switch  onChange={onChange} defaultChecked={e} />)
        }
    ];

    useEffect(() => {
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
                                code: session.code,
                                active: session.active
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
                <Table columns={columns} dataSource={tableData}/>
            </div>
        </div>
    )
}