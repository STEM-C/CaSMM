import React, {useEffect, useState} from "react";
import {getClassroom, setEnrollmentStatus, updateStudent} from "../../Utils/requests";
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
    const [listView, setListView] = useState(true);
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
                    character: student.character,
                    enrolled: {
                        id: student.id,
                        enrolled: student.enrolled
                    }
                })
            });
            setStudentData(data);
        });
    }, [classroomId]);

    const onEnrollToggle = async (id, toggled) => {
        const updatedStudent = await setEnrollmentStatus(id, toggled, getToken());
        let newStudentData = [...studentData];
        const index = studentData.findIndex(function(student) {
            return student.key === id
        });
        newStudentData[index] = {
            key: updatedStudent.id,
            name: updatedStudent.name,
            character: updatedStudent.character,
            enrolled: {
                id: updatedStudent.id,
                enrolled: updatedStudent.enrolled
            }
        };
        setStudentData(newStudentData)
    };

    const isEditing = record => record.key === editingKey;

    const edit = record => {
        form.setFieldsValue({
            name: '',
            character: '',
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

            // update edited row to studentData state
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

            // update student in db
            let student = classroom.students.find(student => student.id === key);
            for(let attribute in row) student[attribute] = row[attribute]
            if(student) {
                updateStudent(student.id, student, getToken())
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
                    <ListView studentData={studentData} onEnrollToggle={onEnrollToggle} editingKey={editingKey}
                              isEditing={isEditing} edit={edit} cancelEdit={cancelEdit} save={save} form={form}/>
                    :
                    <CardView studentData={studentData} onEnrollToggle={onEnrollToggle} editingKey={editingKey}
                              isEditing={isEditing} edit={edit} cancelEdit={cancelEdit} save={save}/>
            }
        </div>
    )
}