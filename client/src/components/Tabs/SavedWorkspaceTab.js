import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
    getCCWorkspaces,
    deleteCCWorkspace,
  } from '../../Utils/requests';


export default function SavedWorkSpaceTab({history, page, setPage, tab, setViewing}){
    const [workspaceList, setWorkspaceList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const wsResponse = await getCCWorkspaces();
            
            await setWorkspaceList(wsResponse.data);
            console.log(wsResponse.data);
        };
        fetchData();
      }, []);
    
    const wsColumn = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          editable: true,
          width: '30%',
          align: 'left',
          render: (_, key) => key.name,
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          editable: true,
          width: '40%',
          align: 'left',
          render: (_, key) => key.description,
        },
        {
          title: 'Open Workspace',
          dataIndex: 'open',
          key: 'open',
          editable: false,
          width: '20%',
          align: 'left',
          render: (_, key) => (
            <Link
              onClick={() =>
                localStorage.setItem('sandbox-day', JSON.stringify(key))
              }
              to={'/sandbox'}
            >
              Open
            </Link>
          ),
        },
        {
          title: 'Delete',
          dataIndex: 'delete',
          key: 'delete',
          width: '10%',
          align: 'right',
          render: (_, key) => (
            <Popconfirm
              title={'Are you sure you want to delete this workspace?'}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={async () => {
                const res = await deleteCCWorkspace(key.id);
                if (res.err) {
                  message.error(res.err);
                } else {
                  setWorkspaceList(
                    workspaceList.filter((ws) => {
                      return ws.id !== key.id;
                    })
                  );
                  message.success('Delete success');
                }
              }}
            >
              <button id={'link-btn'}>Delete</button>
            </Popconfirm>
          ),
        },
    ];


    return (
        <div>
          <div id='page-header'>
            <h1>Saved Worksapces</h1>
          </div>
          <div
            id='content-creator-table-container'
            style={{ marginTop: '6.6vh' }}
          >
            <Table
              columns={wsColumn}
              dataSource={workspaceList}
              rowClassName='editable-row'
              onChange={(Pagination) => {
                setViewing(undefined);
                setPage(Pagination.current);
                history.push(`#${tab}#${Pagination.current}`);
              }}
              pagination={{ current: page ? page : 1 }}
            ></Table>
          </div>
        </div>
    )
}