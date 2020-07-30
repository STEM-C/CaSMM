import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel";
import {getDayToolboxAll} from "../../Utils/requests";
import {message} from "antd";


export default function Sandbox() {
    const [day, setDay] = useState(null);

    useEffect(() => {
        const localDay = localStorage.getItem("sandbox-day");

        if (!localDay) {
            let loadedDay = JSON.parse(localDay);
            setDay(loadedDay)
        } else {
            getDayToolboxAll().then(res => {
                if (res.data) {
                    let loadedDay = {toolbox: res.data.toolbox};

                    localStorage.setItem("sandbox-day", JSON.stringify(loadedDay));
                    setDay(loadedDay)
                } else {
                    const err = res.err ? res.err : "An error occurred.";
                    message.error(err);
                }
            })
        }
    }, []);

    return (
        <div className='container'>
            <BlocklyCanvasPanel day={day} dayType={"sandbox-day"} homePath={'/'}/>
        </div>
    );

}
