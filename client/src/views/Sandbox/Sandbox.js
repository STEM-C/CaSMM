import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel";
import {getActivityToolboxAll} from "../../Utils/requests";


export default function Sandbox() {
    const [day, setDay] = useState(null);

    useEffect(() => {
        const localDay = localStorage.getItem("sandbox-day");

        if (localDay) {
            let loadedDay = JSON.parse(localDay);
            setDay(loadedDay)
        } else {
            getActivityToolboxAll().then(response => {
                let loadedDay = {toolbox: response.toolbox};

                localStorage.setItem("sandbox-day", JSON.stringify(loadedDay));
                setDay(loadedDay)
            })
        }
    }, []);

    return (
        <div className='container'>
            <BlocklyCanvasPanel day={day} dayType={"sandbox-day"} homePath={'/'}/>
        </div>
    );

}
