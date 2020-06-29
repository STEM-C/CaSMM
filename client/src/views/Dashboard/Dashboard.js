import React, {useEffect, useState} from "react"
import {getMentor, getClassroom, updateSession} from "../../Utils/requests"
import {removeUserSession, getUser, getToken} from "../../Utils/AuthRequests";
import {Table, Switch} from 'antd';
import './Dashboard.less'

import Header from '../../components/Header.js'

export default function Dashboard(props) {
    const [tableData, setTableData] = useState([]);
    const [classFilters, setClassFilters] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState([]);
    const [sessions, setSessions] = useState([])
    const user = getUser();

    useEffect(() => {
        getMentor(sessionStorage.getItem('token')).then(mentor => {
            let data = [];
            let filters = [];
            let sessionData = [];
            console.log(mentor)
            mentor.classrooms.map(classroom => {
                if (classroom) {
                    filters.push({
                        text: classroom.name,
                        value: classroom.name
                    })
                }
                getClassroom(classroom.id, getToken()).then(fullClassroom => {
                    console.log(fullClassroom)
                    fullClassroom.sessions.map(session => {
                        sessionData.push(session);
                        data.push({
                            key: session.id,
                            classroom: classroom.name,
                            session: session.name,
                            description: session.description,
                            code: session.code,
                            active: {
                                id: session.id,
                                active: session.active
                            }
                        })
                    })
                })
            });
            setSessions(sessionData);
            setClassFilters(filters);
            setTableData(data)
        })
    }, []);

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    };

    const handleFilterChange = (pagination, filters) => {
        setFilteredInfo(filters)
    };

    const onToggle = (id, toggled) => {
        let session = sessions.find(x => x.id === id);
        session.active = toggled;
        updateSession(id, session, sessionStorage.getItem('token')).then((response) => {
            console.log(response)
        })
    };

    const columns = [
        {
            title: 'Classroom',
            dataIndex: 'classroom',
            key: 'classroom',
            align: 'left',
            filters: classFilters,
            filteredValue: filteredInfo.classroom || null,
            onFilter: (value, record) => record.classroom.includes(value)
        },
        {
            title: 'Session Name',
            dataIndex: 'session',
            key: 'session',
            align: 'right',
            sorter: {
                compare: (a, b) => a.session < b.session ? -1 : 1,
                multiple: 1
            }
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
            render: (active) => (< Switch onChange={e => {
                onToggle(active.id, e)
            }} defaultChecked={active.active}/>)
        }
    ];

    return (
        <div className="container">
            <Header user={user.username} handleLogout={handleLogout}/>
            <div className='table-container'>
                <Table columns={columns} dataSource={tableData} onChange={handleFilterChange}/>
            </div>
        </div>
    )
}