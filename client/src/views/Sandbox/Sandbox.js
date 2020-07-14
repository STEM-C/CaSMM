import React, {useEffect, useState} from "react"
import "../Workspace/Workspace.less"
import BlocklyCanvasPanel from "../../components/BlocklyCanvasPanel/BlocklyCanvasPanel";
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
        <BlocklyCanvasPanel activity={activity} activityType={"sandbox-activity"}/>
    );

}
