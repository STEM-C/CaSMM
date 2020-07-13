import React, {useEffect, useState} from "react";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";
import './Roster.less'
import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import ListView from "./ListView";
import CardView from "./CardView";
import {Form} from "antd";

export default function Roster(props) {
    const [form] = Form.useForm();
    const [studentData, setStudentData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [classroom, setClassroom] = useState([]);
    const [listView, setListView] = useState(true)
    const {history, handleLogout}= props;
    const path = history.location.pathname.split('/');
    const classroomId = path[path.length-1];

    useEffect( () => {
        let data = [];
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
            classroom.students.forEach(student => {
                data.push({
                    key: student.id,
                    name: student.name,
                    animal: student.character,
                    active: {
                        id: student.id,
                        // TODO: when student has 'active' status
                        //  active: student.active
                    }
                })
            });
            setStudentData(data);
        });
    }, [classroomId]);

    const isEditing = record => record.key === editingKey;

    const edit = record => {
        form.setFieldsValue({
            name: '',
            animal: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancelEdit = () => {
        setEditingKey('');
    };

    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...studentData];
            const index = newData.findIndex(item => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setStudentData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setStudentData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    return (
        <div className="container">
            <div id='main-header'>{classroom.name}</div>
            <MentorSubHeader title={'Your Students:'} toDashActive={true} addUserActive={true}
                             cardViewActive={listView} listViewActive={!listView} setListView={setListView}
                             handleLogout={handleLogout}/>
            {
                listView ?
                    <ListView studentData={studentData} editingKey={editingKey} isEditing={isEditing}
                              edit={edit} cancelEdit={cancelEdit} save={save} form={form}/>
                    :
                    <CardView studentData={studentData} editingKey={editingKey} isEditing={isEditing}
                              edit={edit} cancelEdit={cancelEdit} save={save}/>
            }
        </div>
    )
}