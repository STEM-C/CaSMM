import { Button, Modal, Menu } from 'antd';
import React, { useState } from 'react';
import {
  getCCWorkspaces,
  getClassroomWorkspace,
} from '../../../../Utils/requests';

const LoadWorkspaceModal = ({ loadSave, classroomId, workspaceRef }) => {
  const [visible, setVisible] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [hover, setHover] = useState(false)
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

  const handleSelected = (template) => {
    let xml = template;
    //inject
    let dom = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
    setVisible(false);
  };
  const onHover = () => {
    setHover(true)
  }
  const onLeave = () => {
    setHover(false)
  }
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div
      id="display-diagram-modal"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {hover ? <div className="popup ModalCompile">Snippets</div> : ""}
      <Button id="link">
      <svg xmlns="http://www.w3.org/2000/svg" onClick={showModal} width="25" height="35" fill="currentColor" viewBox="0 -70 542 554"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg>
        {/* <svg xmlns="http://www.w3.org/2000/svg" onClick={showModal} width="25" height="32" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 13"> <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/> </svg> */}
      </Button>

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
                      <Button onClick={() => handleSelected(workspace.template)}>
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
