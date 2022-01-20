import React, { useEffect, useState } from 'react';
import {
  deleteStudent,
  getClassroom,
  setEnrollmentStatus,
  updateStudent,
} from '../../../../Utils/requests';
import './Roster.less';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import ListView from './ListView';
import CardView from './CardView';
import { Form, message } from 'antd';

export default function Roster(props) {
  const [form] = Form.useForm();
  const [studentData, setStudentData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [listView, setListView] = useState(true);
  const [classroom, setClassroom] = useState({});
  const { classroomId, history } = props;

  useEffect(() => {
    let data = [];
    getClassroom(classroomId).then((res) => {
      if (res.data) {
        const classroom = res.data;
        setClassroom(classroom);
        classroom.students.forEach((student) => {
          data.push({
            key: student.id,
            name: student.name,
            character: student.character,
            enrolled: {
              id: student.id,
              enrolled: student.enrolled,
            },
            last_logged_in: student.last_logged_in
              ? cleanDatetime(student.last_logged_in)
              : null,
          });
        });
        setStudentData(data);
      } else {
        message.error(res.err);
      }
    });
  }, [classroomId]);

  const cleanDatetime = (dt) => {
    const date = new Date(Date.parse(dt));
    return date;
  };

  const getFormattedDate = (d) => {
    if (d) {
      const day = d.getDate();
      const month = d.getMonth() + 1;
      let hrs = d.getHours();
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12;
      let min = d.getMinutes();
      min = min < 10 ? '0' + min : min;
      return `${month}/${day} ${hrs}:${min} ${ampm}`;
    } else {
      return 'N/A';
    }
  };

  const onEnrollToggle = async (id, toggled) => {
    const res = await setEnrollmentStatus(id, toggled);
    if (res.data) {
      const updatedStudent = res.data;
      let newStudentData = [...studentData];
      const index = studentData.findIndex(function (student) {
        return student.key === id;
      });
      newStudentData[index] = {
        key: updatedStudent.id,
        name: updatedStudent.name,
        character: updatedStudent.character,
        enrolled: {
          id: updatedStudent.id,
          enrolled: updatedStudent.enrolled,
        },
        last_logged_in: updatedStudent.last_logged_in
          ? cleanDatetime(updatedStudent.last_logged_in)
          : null,
      };
      setStudentData(newStudentData);
      message.success(
        `Successfully updated ${updatedStudent.name}'s enrollment status.`
      );
    } else {
      message.error(res.err);
    }
  };

  const addStudentsToTable = (students) => {
    let newStudentData = [...studentData];
    students.forEach((student) =>
      newStudentData.push({
        key: student.id,
        name: student.name,
        character: student.character,
        enrolled: {
          id: student.id,
          enrolled: student.enrolled,
        },
        last_logged_in: student.last_logged_in
          ? cleanDatetime(student.last_logged_in)
          : null,
      })
    );
    setStudentData(newStudentData);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
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

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      // update edited row to studentData state
      const newData = [...studentData];
      const index = newData.findIndex((item) => key === item.key);

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
      let student = classroom.students.find((student) => student.id === key);
      for (let attribute in row) student[attribute] = row[attribute];
      if (student) {
        const res = await updateStudent(student.id, student);
        if (res.data) {
          message.success(
            `Successfully updated ${res.data.name}'s information.`
          );
        } else {
          message.error(res.err);
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = async (key) => {
    const dataSource = [...studentData];
    setStudentData(dataSource.filter((item) => item.key !== key));

    const res = await deleteStudent(key);
    if (res.data) {
      message.success(`Successfully deleted student, ${res.data.name}.`);
    } else {
      message.error(res.err);
    }
  };

  const handleBack = () => {
    history.push('/dashboard');
  };

  return (
    <div>
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <MentorSubHeader
        title={'Your Students'}
        addStudentsToTable={addStudentsToTable}
        addUserActive={true}
        classroomId={classroomId}
        cardViewActive={listView}
        listViewActive={!listView}
        setListView={setListView}
      />
      {listView ? (
        <ListView
          studentData={studentData}
          onEnrollToggle={onEnrollToggle}
          editingKey={editingKey}
          isEditing={isEditing}
          edit={edit}
          cancelEdit={cancelEdit}
          save={save}
          form={form}
          handleDelete={handleDelete}
          getFormattedDate={getFormattedDate}
        />
      ) : (
        <CardView
          studentData={studentData}
          onEnrollToggle={onEnrollToggle}
          getFormattedDate={getFormattedDate}
        />
      )}
    </div>
  );
}
