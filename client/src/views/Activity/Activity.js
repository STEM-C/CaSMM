import React, {useEffect, useState} from "react"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import ActivityInfoPanel from "../../components/ActivityPanels/ActivityInfoPanel";
import NavBar from "../../components/NavBar/NavBar";


export default function Activity(props) {
    const [activity, setActivity] = useState({})
    const {handleLogout, history} = props

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
            props.history.push('/dashboard')
        }
    }, [props])

    const toActivityList = () => {
        history.push(`/classroom/1#home`)
    }

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} history={history}/>
            <div className="flex flex-row">
                <ActivityInfoPanel activity={activity}/>
                <BlocklyCanvasPanel activity={activity} activityType={"my-activity"} toActivityList={toActivityList}/>
            </div>
        </div>
    );

}