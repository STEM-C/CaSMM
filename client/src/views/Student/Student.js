import React, {useState, useEffect} from 'react'
import {getStudentClassroom} from "../../Utils/requests"
import './Student.less'
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";

function Student(props) {
    const [learningStandard, setLearningStandard] = useState({});
    const [selectedDay, setSelectedDay] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStudentClassroom();
                if (res.data) {
                    if(res.data.learning_standard){
                        console.log(res.data);
                        setLearningStandard(res.data.learning_standard)
                    }
                } else {
                    message.error(res.err);
                }
            } catch {}
        };
        fetchData()
    }, []);

    const handleSelection = (day) => {
        setSelectedDay(day);
        localStorage.setItem("my-day", JSON.stringify(day));

        props.history.push("/workspace")
    };

    return (
        <div className='container nav-padding'>
            <NavBar isStudent={true}/>
            <div id='activity-container'>
                <div id='header'>
                    <div>Select your Day</div>
                </div>
                <ul>
                    {
                        learningStandard.days ?
                            learningStandard.days.sort((day1, day2) => day1.number - day2.number).map(day =>
                                <div key={day.id}
                                     id='list-item-wrapper'
                                     onClick={() => handleSelection(day)}>
                                    <li>
                                        {`${learningStandard.name}: Day ${day.number}`}
                                    </li>
                                </div>
                            )
                            : <div>
                                <p>There is currently no active learning standard set.</p>
                                <p>When your classroom manager selects one, it will appear here.</p>
                            </div>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Student