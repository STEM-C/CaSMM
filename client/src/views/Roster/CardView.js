import React from 'react';
import {Card} from "antd";

export default function CardView(props) {
    const {studentData} = props;

    return(
        <div id='card-container'>
            {studentData.map(student =>
                <Card id='card' title={student.name}>
                    <div id='card-content-container'>
                        <p>Animal: {student.animal}</p>
                        <p>Number of Submissions: ###</p>
                        <p>Status: *Active*</p>
                    </div>
                    <div id='card-button-container' className='flex flex-row'>
                        <button onClick={() => {}}>View</button>
                        {/*<button onClick={() => {}}>Edit</button>*/}
                        <button onClick={() => {}}>Deactivate</button>
                    </div>
                </Card>
            )}
        </div>
    )
}
