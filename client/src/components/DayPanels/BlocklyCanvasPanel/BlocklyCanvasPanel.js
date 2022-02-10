import React from 'react';
import PublicCanvas from './canvas/PublicCanvas';
import StudentCanvas from './canvas/StudentCanvas';
import MentorCanvas from './canvas/MentorCanvas';
import ContentCreatorCanvas from './canvas/ContentCreatorCanvas';
import { useGlobalState } from '../../../Utils/userState';

const BlocklyCanvasPanel = ({ day, isSandbox, setDay }) => {
  const [value] = useGlobalState('currUser');

  const userRole = value.role;

  switch (userRole) {
    case 'DefaultUser':
      return <PublicCanvas day={day} isSandbox={isSandbox} />;
    case 'Student':
      return <StudentCanvas day={day} />;
    case 'Mentor':
      return <MentorCanvas day={day} setDay={setDay} isSandbox={isSandbox} />;
    case 'ContentCreator':
      return (
        <ContentCreatorCanvas day={day} setDay={setDay} isSandbox={isSandbox} />
      );
    default:
      return <div></div>;
  }
};

export default BlocklyCanvasPanel;
