import React, {useEffect, useState} from "react";
import {getClassroom, setEnrollmentStatus, updateStudent} from "../../../Utils/requests";
import './Roster.less'
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import ListView from "./ListView";
import CardView from "./CardView";
import {Form, message} from "antd";

export default function Roster(props) {
    const [form] = Form.useForm();
    const [studentData, setStudentData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [listView, setListView] = useState(true);
    const [classroom, setClassroom] = useState({})
    const {classroomId, history} = props;

    useEffect(() => {
        let data = [];
        getClassroom(classroomId).then(res => {
            if (res.data) {
                const classroom = res.data;
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
            } else {
                message.error(res.err);
            }
        });
    }, [classroomId]);

    const onEnrollToggle = async (id, toggled) => {
        const res = await setEnrollmentStatus(id, toggled);
        if (res.data) {
            const updatedStudent = res.data;
            let newStudentData = [...studentData];
            const index = studentData.findIndex(function (student) {
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
            setStudentData(newStudentData);
            message.success(`Successfully updated ${updatedStudent.name}'s enrollment status.`);
        } else {
            message.error(res.err);
        }
    };

    const addStudentsToTable = (students) => {
        let newStudentData = [...studentData];
        students.forEach(student => newStudentData.push({
            key: student.id,
            name: student.name,
            character: student.character,
            enrolled: {
                id: student.id,
                enrolled: student.enrolled
            }
        }));
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
                newData.splice(index, 1, {...item, ...row});
                setStudentData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setStudentData(newData);
                setEditingKey('');
            }

            // update student in db
            let student = classroom.students.find(student => student.id === key);
            for (let attribute in row) student[attribute] = row[attribute]
            if (student) {
                const res = await updateStudent(student.id, student);
                if (res.data) {
                    message.success(`Successfully updated ${res.data.name}'s information.`);
                } else {
                    message.error(res.err);
                }
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    return (
        <div>
            <MentorSubHeader title={'Your Students:'} addStudentsToTable={addStudentsToTable} addUserActive={true} classroomId={classroomId}
                             cardViewActive={listView} listViewActive={!listView} setListView={setListView}/>
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