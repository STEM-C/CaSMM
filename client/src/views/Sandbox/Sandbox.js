import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel";
import {getActivityToolboxAll} from "../../Utils/requests";


export default function Sandbox() {
    const [day, setDay] = useState(null);

    useEffect(() => {
        const localActivity = localStorage.getItem("sandbox-day");

        if (localActivity) {
            let loadedActivity = JSON.parse(localActivity);
            setDay(loadedActivity)
        } else {
            getActivityToolboxAll().then(response => {
                let loadedActivity = {toolbox: response.toolbox};

                localStorage.setItem("sandbox-day", JSON.stringify(loadedActivity));
                setDay(loadedActivity)
            })
        }
    }, []);

    return (
        <div className='container'>
            <BlocklyCanvasPanel day={day} activityType={"sandbox-day"} homePath={'/'}/>
        </div>
    );

}
