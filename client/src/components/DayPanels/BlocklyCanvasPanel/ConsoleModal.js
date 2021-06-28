import {Button} from 'antd';
import React, {useState} from "react";
import { openConnection, disconnect } from "../ConsoleView";

export default function ConsoleModal(props) {
    const [connectionOpen, setConnectionOpen] = useState(false);
    const [baudRate, setBaudRate] = useState(9600);


    const handleConnect = () => {
        if(!connectionOpen){
            openConnection(baudRate);
            if(typeof window['port'] !== 'undefined'){
                setConnectionOpen(true);
                document.getElementById("connect-button").innerHTML = "Disconnect";
            }
        }
        else{
            console.log('Close connection');
            disconnect();
            setConnectionOpen(false);
            document.getElementById("connect-button").innerHTML = "Connect";
        }
    }

    const handleChange = (event) => {
        setBaudRate(event.target.value);
    }

    return(
        <div id="console-container">
            <label className = "label">Baud Rate: </label>
            <select value={baudRate} onChange={handleChange}>
                <option value="9600" >9600</option>
                <option value="115200">115200</option>
                <option value="57600">57600</option>
                <option value="38400">38400</option>
                <option value="19200">19200</option>
                <option value="4800">4800</option>
                <option value="2400">2400</option>
                <option value="1800">1800</option>
                <option value="1200">1200</option>
                <option value="600">600</option>
                <option value="300">300</option>
                <option value="200">200</option>
                <option value="150">150</option>
                <option value="134">134</option>
                <option value="110">110</option>
                <option value="75">75</option>
                <option value="50">50</option>
            </select>
            <Button id="connect-button" onClick = {()=>handleConnect()}>Connect</Button>
            <div id="content-container">
                <p id="console-content">Waiting for input...</p>
            </div>
        </div>
    )
}