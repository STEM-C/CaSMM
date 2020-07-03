import React, {useState} from 'react'
import { getStudents } from "../../Utils/requests";

export default function StudentLoginForm(props) {
    const [error, setError] = useState(null);

    const setStudentOptions = () => {
        let options = [];
        for(let i = 0; i < props.studentList.length; i++){
            options.push(<option value={props.studentList[i].id}>{props.studentList[i].name}</option>)
        }
        return options
    };

    const setAnimalOptions = () => {
        let options = [];
        for(let i = 0; i < props.animalList.length; i++){
            options.push(<option value={props.animalList[i]}>{props.animalList[i]}</option>)
        }
        return options
    };


    return(
        <div className="box" onKeyPress={e => {if(e.key === 'Enter') props.handleLogin()}}>
            <div className='select-lable'>
                Student {props.entryNum} Name:
            </div>
            <select name='student' onChange={e => props.updateStudentUsers(e.target.value, props.entryNum)}>
                <option value='default' disabled selected className='disabled-option'>Student Name</option>
                {setStudentOptions().map(option => option)}
            </select>
            <div className='select-lable'>
                Student {props.entryNum} Animal:
            </div>
            <select name='animal' onChange={e => props.updateStudentAnimals(e.target.value, props.entryNum)}>
                <option value='default' disabled selected className='disabled-option'>Student Animal</option>
                {setAnimalOptions().map(option => option)}
            </select>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}