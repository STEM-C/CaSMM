import React from 'react';
import PublicCanvas from './canvas/PublicCanvas';
import StudentCanvas from './canvas/StudentCanvas';
import MentorCanvas from './canvas/MentorCanvas';
import ContentCreatorCanvas from './canvas/ContentCreatorCanvas';

const BlocklyCanvasPanel = ({ day, isSandbox, userRole }) => {
  switch (userRole) {
    case 'DefaultUser':
      return <PublicCanvas day={day} isSandbox={isSandbox} />;
    case 'Student':
      return <StudentCanvas day={day} />;
    case 'Mentor':
      return <MentorCanvas day={day} />;
    case 'ContentCreator':
      return <ContentCreatorCanvas day={day} isSandbox={isSandbox} />;
    default:
      return <div></div>;
  }
};

export default BlocklyCanvasPanel;
