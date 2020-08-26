import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel";
import NavBar from "../../components/NavBar/NavBar";
import {getDayToolbox} from "../../Utils/requests";
import {message} from "antd";


export default function Day(props) {
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

    const handleHome = () => {
        history.push('/dashboard')
    };

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} handleHome={handleHome} isMentor={true}/>
            <div className="flex flex-row">
                <BlocklyCanvasPanel
                    day={day}
                    dayType={"my-day"}
                    lessonName={`Learning Standard ${day.learning_standard}, Day ${day.number}`}
                    handleGoBack={handleGoBack}/>
            </div>
        </div>
    );

}