import React, {useEffect, useState} from "react";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";
import {Table, Form, Popconfirm, Input} from 'antd'
import './Roster.less'

export default function Roster(props) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [classroom, setClassroom] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const {history}= props;
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
                })
            });
            setTableData(data);
        });
    }, []);

    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              ...restProps
                          }) => {
        const inputNode = <Input/>;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const isEditing = record => record.key === editingKey;

    const edit = record => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
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
            const newData = [...tableData];
            const index = newData.findIndex(item => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setTableData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setTableData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            align: 'left',
            sorter: {
                compare: (a, b) => a.session < b.session ? -1 : 1,
                multiple: 1
            }
        },
        {
            title: 'Animal',
            dataIndex: 'animal',
            key: 'animal',
            editable: true,
            align: 'right',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <a
                href="javascript:;"
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </a>
            <Popconfirm title="Are you sure you want to cancel?" onConfirm={cancelEdit}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </a>
                );
            }
        },
        /*{
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: 'right',
            render: (active) => (
                <>
                    <a onClick={() => edit(record)}>View</a>
                    <a href='#'>Edit</a>
                    <a href='#'>Remove</a>
                </>
            )
        }*/
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: record => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <div className="container">
            <h1>{classroom.name}</h1>
            <h2>Your Students:</h2>
            <div id='table-container'>
                <Form form={form} component={false}>
                    <Table columns={mergedColumns}
                           dataSource={tableData}
                           components={{
                               body: {
                                   cell: EditableCell,
                               },
                           }}
                           rowClassName="editable-row"
                           pagination={{
                               onChange: cancelEdit,
                           }}
                    />
                </Form>
            </div>
        </div>
    )
}