import React, {useEffect, useState} from "react"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import ActivityInfoPanel from "../../components/ActivityPanels/ActivityInfoPanel";


export default function Workspace(props) {
    const [activity, setActivity] = useState({})
    const {handleLogout} = props

    useEffect(() => {
        const localActivity = localStorage.getItem("my-activity")
        const {selectedActivity} = props

        if (localActivity && !selectedActivity) {
            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)

        } else if (selectedActivity) {
            getActivityToolbox(selectedActivity.id, getToken()).then(response => {
                let loadedActivity = {...selectedActivity, toolbox: response.toolbox}

                localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        } else {
            props.history.push('/')
        }
    }, [props])

    return (
        <div className="container flex flex-row">
            <ActivityInfoPanel activity={activity}/>
            <BlocklyCanvasPanel activity={activity} activityType={"my-activity"} homePath={'/student'} handleLogout={handleLogout}/>
        </div>
    );

}
