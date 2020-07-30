import React, {useEffect, useState} from "react"
import {getDayToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel";
import DayInfoPanel from "../../components/DayPanels/DayInfoPanel";
import {message} from "antd";


export default function Workspace(props) {
    const [day, setDay] = useState({});
    const {handleLogout, history} = props;

    useEffect(() => {
        const localDay = JSON.parse(localStorage.getItem("my-day"));

        if (localDay) {
            if (localDay.toolbox) {
                setDay(localDay)
            } else {
                getDayToolbox(localDay.id, getToken()).then(res => {
                    if (res.data) {
                        let loadedDay = {...localDay, toolbox: res.toolbox};

                        localStorage.setItem("my-day", JSON.stringify(loadedDay));
                        setDay(loadedDay)
                    } else {
                        const err = res.err ? res.err : "An error occurred.";
                        message.error(err);
                    }
                })
            }

        } else {
            history.goBack()
        }
    }, [history]);

    return (
        <div className="container flex flex-row">
            <DayInfoPanel day={day}/>
            <BlocklyCanvasPanel day={day} dayType={"my-day"} homePath={'/student'} handleLogout={handleLogout}/>
        </div>
    );

}
