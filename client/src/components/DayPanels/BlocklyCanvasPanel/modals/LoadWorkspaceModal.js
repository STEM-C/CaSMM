import { Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { getCCWorkspaces } from '../../../../Utils/requests';

const LoadWorkspaceModal = ({ hover, setHover, loadSave }) => {
  const [visible, setVisible] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);

  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    const setup = async () => {
      const res = await getCCWorkspaces();
      if (res.data) {
        setWorkspaces(res.data);
      }
    };
    setup();
  }, []);

  const handleSelected = (id) => {
    loadSave(id);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div id='link'>
      <i
        onClick={showModal}
        className='flex fas fa-file-download'
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
