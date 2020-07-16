import React from 'react';
import {Card} from "antd";
import StudentModal from "./StudentModal";

export default function CardView(props) {
    const {studentData} = props;

    return(
        <div id='card-container'>
            {studentData.map(student =>
                <Card id='card' title={student.name} key={student.key}>
                    <div id='card-content-container'>
                        <p>Animal: {student.animal}</p>
                        <p>Number of Submissions: ###</p>
                        <p>Status: *Active*</p>
                    </div>
                    <div id='card-button-container' className='flex flex-row'>
                        <StudentModal student={student} linkBtn={false}/>
                        {/*<button onClick={() => {}}>Edit</button>*/}
                        <button onClick={() => {}}>Deactivate</button>
                    </div>
                </Card>
            )}
        </div>
    )
}
