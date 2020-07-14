import React, {useEffect, useState} from "react"
import "./Workspace.less"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/BlocklyCanvasPanel/BlocklyCanvasPanel";
import ActivityInfoPanel from "../../components/ActivityInfoPanel/ActivityInfoPanel";


export default function Workspace(props) {
    const [activity, setActivity] = useState({})

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
        <div>
            <div className="container flex flex-row">
                <div id='horizontal-container' className="flex flex-column">
                    <ActivityInfoPanel activity={activity}/>
                </div>
                <div id='horizontal-container' className="flex flex-column">
                    <BlocklyCanvasPanel activity={activity} activityType={"my-activity"}/>
                </div>
            </div>
        </div>
    );

}
