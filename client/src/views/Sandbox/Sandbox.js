import React, {useEffect, useState} from "react"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel";
import {getDayToolboxAll} from "../../Utils/requests";
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";


export default function Sandbox(props) {
    const [day, setDay] = useState(null);
    const {history} = props;

    useEffect(() => {
        const localDay = JSON.parse(localStorage.getItem("sandbox-day"));

        if (localDay) {
            let loadedDay = localDay;
            setDay(loadedDay)
        } else {
            getDayToolboxAll().then(res => {
                if (res.data) {
                    let loadedDay = {toolbox: res.data.toolbox};

                    localStorage.setItem("sandbox-day", JSON.stringify(loadedDay));
                    setDay(loadedDay)
                } else {
                    message.error(res.err);
                }
            })
        }
    }, []);

    const handleHome = () => {
        history.push('/')
    };

    const handleTeacherLogin = () => {
        history.push('/teacherlogin')
    };

    const handleAbout = () => {
        history.push('/about')
    };

    return (
        <div className='container nav-padding'>
            <NavBar handleTeacherLogin={handleTeacherLogin} handleHome={handleHome} handleAbout={handleAbout}/>
            <BlocklyCanvasPanel day={day} dayType={"sandbox-day"} homePath={'/'}/>
        </div>
    );

}
