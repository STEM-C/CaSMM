import React, {useEffect, useState} from "react"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import ActivityInfoPanel from "../../components/ActivityPanels/ActivityInfoPanel";
import NavBar from "../../components/NavBar/NavBar";


export default function Activity(props) {
    const [day, setDay] = useState({});
    const {handleLogout, history} = props;

    useEffect(() => {
        const localDay = localStorage.getItem("my-day");
        const {selectedActivity} = props;

        if (localDay && !selectedActivity) {
            let loadedActivity = JSON.parse(localDay);
            setDay(loadedActivity)

        } else if (selectedActivity) {
            getActivityToolbox(selectedActivity.id, getToken()).then(response => {
                let loadedDay = {...selectedActivity, toolbox: response.toolbox};

                localStorage.setItem("my-day", JSON.stringify(loadedDay));
                setDay(loadedDay)
            })
        } else {
            props.history.push('/dashboard')
        }
    }, [props]);

    const handleGoBack = () => {
        history.goBack()
    };

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} history={history}/>
            <div className="flex flex-row">
                <ActivityInfoPanel day={day}/>
                <BlocklyCanvasPanel day={day} activityType={"my-day"} handleGoBack={handleGoBack}/>
            </div>
        </div>
    );

}