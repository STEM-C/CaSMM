import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import {getActivityToolboxAll} from "../../Utils/requests";


export default function Sandbox() {
    const [activity, setActivity] = useState(null)

    useEffect(() => {
        const localActivity = localStorage.getItem("sandbox-activity")

        if (localActivity) {
            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)
        } else {
            getActivityToolboxAll().then(response => {
                let loadedActivity = {toolbox: response.toolbox}

                localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        }
    }, []);

    return (
        <div className='container'>
            <BlocklyCanvasPanel activity={activity} activityType={"sandbox-activity"} homePath={'/'}/>
        </div>
    );

}
