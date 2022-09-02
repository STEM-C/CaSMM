import { Button, Modal, Menu } from 'antd';
import React, { useState } from 'react';
import {
  getCCWorkspaces,
  getClassroomWorkspace,
} from '../../../../Utils/requests';

const LoadWorkspaceModal = ({ loadSave, classroomId }) => {
  const [visible, setVisible] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);

  const showModal = async () => {
    let res;
    if (classroomId) {
      res = await getClassroomWorkspace(classroomId);
    } else {
      res = await getCCWorkspaces();
    }
    if (res.data) {
      setWorkspaces(res.data);
    }
    setVisible(true);
  };

  const handleSelected = (id) => {
    if (loadSave(id)) setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Menu.Item id='menu-save' onClick={showModal}>
        <i className='flex fas fa-file-upload'></i>
        &nbsp; Load Workspaces
      </Menu.Item>
      <Modal
        title='Load From Saved Workspaces'
        visible={visible}
        onCancel={handleCancel}
        width='40vw'
        footer={null}
      >
        <ul>
          {workspaces
            ? workspaces.map((workspace) => (
                <li value={workspaces.id} key={workspaces.id}>
                  <div id='history-item'>
                    <div id='item-content'>
                      <b>{workspace.name}</b> - {workspace.description}
                    </div>
                    <div id='item-content'>
                      <Button onClick={() => handleSelected(workspace.id)}>
                        Load Workspace
                      </Button>
                    </div>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </Modal>
    </div>
  );
};

export default LoadWorkspaceModal;
