import React from 'react';
import {Card} from "antd";
import StudentModal from "./StudentModal";

export default function CardView(props) {
    const {studentData, onEnrollToggle, getFormattedDate} = props;

    return (
        <div id='card-container'>
            {studentData.map(student =>
                // <Card id='student-card' title={student.name} key={student.key}>
                //     <div id='card-content-container'>
                //         <p id='testing'>{student.character}</p>
                //         <p>Last logged in: {getFormattedDate(student.last_logged_in)}
                //         </p>
                //         <p>Status: {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}</p>
                //     </div>
                //     <div id='card-button-container' className='flex flex-row'>
                //         <StudentModal student={student} linkBtn={false}/>
                //         <button onClick={() => {
                //             onEnrollToggle(student.enrolled.id, !student.enrolled.enrolled)
                //         }}>
                //             {student.enrolled.enrolled ? 'Unenroll' : 'Enroll'}
                //         </button>
                //     </div>
                // </Card>

            <div id='student-card' key={student.key}>
                <div id='student-card-header'>
                    <p id='animal'>{student.character}</p>
                    <h1 id='student-card-title'>{student.name}</h1>
                </div>
                <div id='card-content-container'>
                    <p>Last logged in: {getFormattedDate(student.last_logged_in)}</p>
                    <p>Status: {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}</p>
                </div>
                <div id='card-button-container' className='flex flex-row'>
                    <StudentModal student={student} linkBtn={false}/>
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
