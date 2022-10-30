import React from 'react';
import { Link } from 'react-router-dom';
import AddStudentsModal from '../../views/Mentor/Classroom/Roster/AddStudents/AddStudentsModal';
import './MentorSubHeader.less';

export default function MentorSubHeader(props) {
  const {
    title,
    addActivityActive,
    addUserActive,
    classroomId,
    cardViewActive,
    listViewActive,
    checkoutActive,
    setListView,
    addStudentsToTable,
  } = props;

  return (
    <div id='page-header'>
      <h1>{title}</h1>
      <span id='header-nav'>
        {addActivityActive ? (
          <button id='link'>
            <i className='fa fa-plus-square' />
          </button>
        ) : null}
        {addUserActive ? (
          <AddStudentsModal
            addStudentsToTable={addStudentsToTable}
            classroomId={classroomId}
          />
        ) : null}
        {cardViewActive ? (
          <button onClick={() => setListView(false)} id='link'>
            <i className='fa fa-th' />
          </button>
        ) : null}
        {listViewActive ? (
          <button onClick={() => setListView(true)} id='link'>
            <i className='fa fa-list-alt' />
          </button>
        ) : null}
        {checkoutActive ? (
          <Link id='link' to={'/dashboard'}>
            <i className='fa fa-shopping-cart' />
          </Link>
        ) : null}
      </span>
    </div>
  );
}
