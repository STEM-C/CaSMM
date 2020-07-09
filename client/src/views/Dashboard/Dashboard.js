import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms, updateSession} from "../../Utils/requests"
import {removeUserSession, getUser, getToken} from "../../Utils/AuthRequests";
import {Table, Switch, Card} from 'antd';
import './Dashboard.less'

import Header from '../../components/Header.js'

export default function Dashboard(props) {
    const [classrooms, setClassrooms] = useState([])
    const user = getUser();

    useEffect( () => {
        let classroomIds = []
        getMentor(getToken()).then(mentor => {
            mentor.classrooms.forEach(classroom => {
                classroomIds.push(classroom.id)
            });
            getClassrooms(classroomIds, getToken()).then(classrooms => {
                setClassrooms(classrooms)
            });
        })
    }, []);

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    };

    return (
        <div className="container">
            <Header user={user.username} handleLogout={handleLogout}/>
            <h1 id='page-header'>Your Classrooms:</h1>
            <div id='card-container' className='flex flex-row'>
                {console.log(classrooms)}
                {classrooms.map(classroom =>
                    <Card id='card' title={classroom.name}>
                        <div id='card-content-container'>
                            <p>Number of students: {classroom.students.length}</p>
                        </div>
                        <div id='card-button-container' className='flex flex-row'>
                            <button>View Roster</button>
                            <button></button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

/*export default function Dashboard(props) {
    const [tableData, setTableData] = useState([]);
    const [classFilters, setClassFilters] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState([]);
    const [sessions, setSessions] = useState([])
    const user = getUser();

    useEffect( () => {
        let data = [];
        let filters = [];
        let sessionData = [];
        let classroomIds = [];
        getMentor(getToken()).then(mentor => {
            mentor.classrooms.forEach(classroom => {
                filters.push({
                    text: classroom.name,
                    value: classroom.name
                });
                classroomIds.push(classroom.id)
            });
            getClassrooms(classroomIds, getToken()).then(classrooms => {
                classrooms.forEach(classroom => {
                    classroom.sessions.forEach(session => {
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
                });
                setTableData(data);
                setSessions(sessionData);
            });
            setClassFilters(filters);
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
            <div id='table-container'>
                <Table columns={columns} dataSource={tableData} onChange={handleFilterChange}/>
            </div>
        </div>
    )
}*/