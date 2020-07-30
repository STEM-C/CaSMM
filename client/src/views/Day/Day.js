import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel";
import DayInfoPanel from "../../components/DayPanels/DayInfoPanel";
import NavBar from "../../components/NavBar/NavBar";
import {getDayToolbox} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";


export default function Day(props) {
    const [day, setDay] = useState({});
    const {handleLogout, history} = props;

    useEffect(() => {
        const localDay = JSON.parse(localStorage.getItem("my-day"));

        if (localDay) {
            if(localDay.toolbox) {
                setDay(localDay)
            } else {
                getDayToolbox(localDay.id, getToken()).then(response => {
                    let loadedDay = {...localDay, toolbox: response.toolbox};

                    localStorage.setItem("my-day", JSON.stringify(loadedDay));
                    setDay(loadedDay)
                })
            }

        } else {
            props.history.goBack()
        }
    }, [history]);

    const handleGoBack = () => {
        history.goBack()
    };

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} history={history}/>
            <div className="flex flex-row">
                <DayInfoPanel day={day}/>
                <BlocklyCanvasPanel day={day} dayType={"my-day"} handleGoBack={handleGoBack}/>
            </div>
        </div>
    );

}