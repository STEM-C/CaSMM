import React, {useEffect, useState} from "react"
import {getDayToolbox} from "../../Utils/requests.js"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel";
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";


export default function Workspace(props) {
    const [day, setDay] = useState({});
    const {handleLogout, history} = props;

    useEffect(() => {
        const localDay = JSON.parse(localStorage.getItem("my-day"));

        if (localDay) {
            if (localDay.toolbox) {
                setDay(localDay)
            } else {
                getDayToolbox(localDay.id).then(res => {
                    if (res.data) {
                        let loadedDay = {...localDay, toolbox: res.data.toolbox};

                        localStorage.setItem("my-day", JSON.stringify(loadedDay));
                        setDay(loadedDay)
                    } else {
                        message.error(res.err);
                    }
                })
            }

        } else {
            history.goBack()
        }
    }, [history]);

    const handleGoBack = () => {
        history.goBack()
    };

    return (
        <div className="container flex flex-row nav-padding">
            <NavBar handleLogout={handleLogout}/>
            <BlocklyCanvasPanel
                day={day}
                lessonName={`Learning Standard ${day.learning_standard}, Day ${day.number}`}
                handleGoBack={handleGoBack}
                handleLogout={handleLogout}
                isStudent={true}/>
        </div>
    );

}
