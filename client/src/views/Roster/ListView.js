import React, {useState} from 'react';
import {Form, Input, Popconfirm, Switch, Table} from "antd";

export default function ListView(props) {
    const {studentData, editingKey, isEditing, edit, cancelEdit, save, form} = props;

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

    const onToggle = (id, toggled) => {
        //TODO: update student 'active' status
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
                    <span>
            <a
                href="javascript:"
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
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            width: '10%',
            align: 'right',
            render: () => (
                <a href='#'>View</a>
            )
        },
        {
            title: 'Activate / Deactivate',
            dataIndex: 'active',
            key: 'active',
            width: '10%',
            align: 'right',
            render: (active) => (<Switch onChange={e => {
                onToggle(active.id, e)
            }} defaultChecked={true}/>)
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
    
    return(
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
