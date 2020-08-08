import React from 'react';
import {Form, Input, Popconfirm, Switch, Table} from "antd";
import StudentModal from "./StudentModal";

export default function ListView(props) {
    const {studentData, onEnrollToggle, editingKey, isEditing, edit, cancelEdit, save, form} = props;

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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            align: 'left',
            sorter: {
                compare: (a, b) => a.name < b.name ? -1 : 1,
                multiple: 1
            }
        },
        {
            title: 'Animal',
            dataIndex: 'character',
            key: 'character',
            editable: true,
            align: 'left',
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            width: '10%',
            align: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span id='edit-options-span'>
            <button
                id='link-btn'
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </button>
            <Popconfirm title="Are you sure you want to cancel?" onConfirm={cancelEdit}>
              <button id='link-btn'>Cancel</button>
            </Popconfirm>
          </span>
                ) : (
                    <button id='link-btn' disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </button>
                );
            }
        },
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            width: '10%',
            align: 'right',
            render: (_, record) => (
                <StudentModal student={record} linkBtn={true}/>
            )
        },
        {
            title: 'Enrolled',
            dataIndex: 'enrolled',
            key: 'enrolled',
            width: '10%',
            align: 'right',
            render: (enrolled) => (<Switch onChange={e => {
                onEnrollToggle(enrolled.id, e)
            }} defaultChecked={enrolled.enrolled}/>)
        }
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
        <div id='table-container'>
            <Form form={form} component={false}>
                <Table columns={mergedColumns}
                       dataSource={studentData}
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
    )
}
