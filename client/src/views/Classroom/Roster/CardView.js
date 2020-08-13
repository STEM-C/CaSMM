import React from 'react';
import {Card} from "antd";
import StudentModal from "./StudentModal";

export default function CardView(props) {
    const {studentData, onEnrollToggle} = props;

    return (
        <div id='card-container'>
            {studentData.map(student =>
                <Card id='card' title={student.name} key={student.key}>
                    <div id='card-content-container'>
                        <p>Animal: {student.character}</p>
                        <p>Last logged in:
                            {
                                ` ${student.last_logged_in.slice(0, 4)}
                                 ${student.last_logged_in.slice(11, 15)}
                                 ${student.last_logged_in.slice(19, 21)}`
                            }
                        </p>
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
                </Card>
            )}
        </div>
    )
}
