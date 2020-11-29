import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel";
import {getDayToolboxAll} from "../../Utils/requests";
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";


export default function Sandbox(props) {
    const [day, setDay] = useState(null);

    useEffect(() => {
        const localDay = JSON.parse(localStorage.getItem("sandbox-day"));

        if (localDay) {
            localStorage.removeItem("sandbox-day");
        }
        getDayToolboxAll().then(res => {
            if (res.data) {
                let loadedDay = {toolbox: res.data.toolbox};

                localStorage.setItem("sandbox-day", JSON.stringify(loadedDay));
                setDay(loadedDay)
            } else {
                message.error(res.err);
            }
        })

    }, []);

    return (
        <div className='container nav-padding'>
            <NavBar />
            <BlocklyCanvasPanel day={day} isSandbox={true} homePath={'/'}/>
        </div>
    );

}
