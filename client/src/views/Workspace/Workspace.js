import React, {useEffect, useState} from "react"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import ActivityInfoPanel from "../../components/ActivityPanels/ActivityInfoPanel";


export default function Workspace(props) {
    const [day, setDay] = useState({});
    const {handleLogout} = props;

    useEffect(() => {
        const localDay = localStorage.getItem("my-day");
        const {selectedActivity} = props;

        if (localDay && !selectedActivity) {
            let loadedDay = JSON.parse(localDay);
            setDay(loadedDay)

        } else if (selectedActivity) {
            getActivityToolbox(selectedActivity.id, getToken()).then(response => {
                let loadedDay = {...selectedActivity, toolbox: response.toolbox};

                localStorage.setItem("my-day", JSON.stringify(loadedDay));
                setDay(loadedDay)
            })
        } else {
            props.history.push('/')
        }
    }, [props]);

    return (
        <div className="container flex flex-row">
            <ActivityInfoPanel day={day}/>
            <BlocklyCanvasPanel day={day} activityType={"my-day"} homePath={'/student'} handleLogout={handleLogout}/>
        </div>
    );

}
