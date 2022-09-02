import React from 'react';
import StudentModal from "./StudentModal";

export default function CardView(props) {
    const {studentData, onEnrollToggle, getFormattedDate} = props;

    return (
        <div id='card-container'>
            {studentData.map(student =>
            <div id='student-card' key={student.key}>
                <div id='student-card-header'>
                    <p id='animal'>{student.character}</p>
                    <h1 id='student-card-title'>{student.name}</h1>
                </div>
                <div id='card-content-container'>
                    <div id="description-container">
                        <p id="label">Last logged in:</p>
                        <p id="label-info">{getFormattedDate(student.last_logged_in)}</p>
                        <br></br>
                    </div>
                    <div id="description-container">
                        <p id="label">Status:</p>
                        <p id="label-info">{student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}</p>
                    </div>
                </div>
                <div id='card-button-container' className='flex flex-row'>
                    <StudentModal student={student} linkBtn={false} getFormattedDate={getFormattedDate}/>
                    <button onClick={() => {
                        onEnrollToggle(student.enrolled.id, !student.enrolled.enrolled)
                    }}>
                        {student.enrolled.enrolled ? 'Unenroll' : 'Enroll'}
                    </button>
                </div>
            </div>
            )}
        </div>
    )
}
