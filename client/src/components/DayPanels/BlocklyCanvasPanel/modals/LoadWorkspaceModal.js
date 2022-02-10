import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { getCCWorkspaces, getClassroomWorkspace } from '../../../../Utils/requests';

const LoadWorkspaceModal = ({ hover, setHover, loadSave, classroomId }) => {
  const [visible, setVisible] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);

  const showModal = async () => {
    let res;
    if(classroomId){
      res = await getClassroomWorkspace(classroomId);
    }
    else{
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
    <div id='link'>
      <i
        onClick={showModal}
        className='flex fas fa-file-upload'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {hover && <div className='popup ModalCompile4'>Load Workspaces</div>}
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
