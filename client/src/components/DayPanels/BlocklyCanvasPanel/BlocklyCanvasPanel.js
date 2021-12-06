import React from 'react';
import PublicCanvas from './canvas/PublicCanvas';
import StudentCanvas from './canvas/StudentCanvas';
import MentorCanvas from './canvas/MentorCanvas';
import ContentCreatorCanvas from './canvas/ContentCreatorCanvas';
import { useGlobalState } from '../../../Utils/userState';

const BlocklyCanvasPanel = ({ day }) => {
  const [value] = useGlobalState('currUser');
  console.log(value.role);
  switch (value.role) {
    case 'DefaultUser':
      return <PublicCanvas day={day} />;
    case 'Student':
      return <StudentCanvas day={day} />;
    case 'Mentor':
      return <MentorCanvas day={day} />;
    case 'ContentCreator':
      return <ContentCreatorCanvas day={day} />;
  }
};

export default BlocklyCanvasPanel;
