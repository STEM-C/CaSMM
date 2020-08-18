import {Divider, message} from 'antd';
import React, {useState} from "react";
import './AddStudents.less'
import {CSVReader} from 'react-papaparse';
import {Table} from 'antd';
import {addStudent, addStudents} from "../../../../Utils/requests";
import Picker from 'emoji-picker-react';

export default function AddStudents(props) {
    const [name, setName] = useState('');
    const [uploadedRoster, setUploadedRoster] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [chosenCharacter, setChosenCharacter] = useState(null);
    const {classroomId, addStudentsToTable} = props;

    const buttonRef = React.createRef();

    const handleManualAdd = async () => {
        const res = await addStudent(name, chosenCharacter ? chosenCharacter.emoji : null, classroomId);
        if (res.data) {
            addStudentsToTable([res.data]);
            message.success(`${name} has been added to the roster successfully.`);
            setChosenCharacter(null);
            setName('')
        } else {
            message.error(res.err)
        }
    };

    const handleCsvAdd = async () => {
        const students = await uploadedRoster.map(student => {
            return {
                name: student.name,
                character: student.animal,
            }
        });
        const res = await addStudents(students, classroomId);
        if (res.data) {
            addStudentsToTable(res.data);
            message.success('Uploaded roster added to classroom successfully.');
        } else {
            message.error(res.err)
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Animal',
            dataIndex: 'animal',
            key: 'animal',
        },
    ];

    const getTableData = async (students) => {
        const tableData = await students.map((student, index) => {
            return {
                key: index,
                name: student.name,
                animal: student.animal
            }
        });
        return tableData
    };

    const handleOnDrop = async (roster) => {
        // on file select, filter out bad data and set uploadedRoster and tableData
        let badInput = false;
        const filteredRoster = roster.filter(student => {
            // verify name is in format "Last, First Middle"
            if (student.data.name) {
                if (student.data.name.search('([A-Za-z]+),\\s*([A-Za-z]+)\\s*([A-Za-z]+)') > -1) return true;
                badInput = true
            }
            return false
        });

        const students = await filteredRoster.map(student => {
            let names = student.data.name.split(" ");
            let name = `${names[1]} ${names[0].substring(0, 1)}.`;
            return {name: name, animal: student.data.animal}
        });
        setUploadedRoster(students);
        const data = await getTableData(students);
        setTableData(data);
        if (badInput || students.length === 0) message.warning(
            "There may have been an issue parsing one or more data entries in the uploaded CSV. " +
            " Please verify that your data is in the specified format.", 8)
    };

    const handleOnRemoveFile = () => {
        // clear uploadedRoster and tableData when file is unselected
        setUploadedRoster([]);
        setTableData([]);
    };

    const handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
            buttonRef.current.removeFile(e)
        }
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.error(err);
        message.error("Failed to parse the uploaded file.")
    };

    const onEmojiClick = (event, emojiObject) => {
        setChosenCharacter(emojiObject);
    };

    return (
        <div id='add-students'>
            <div id='manual-input'>
                <h3>Manual Input:</h3>
                <form>
                    <input type="text" value={name} onChange={e => {
                        setName(e.target.value)
                    }}
                           id="name" name="name" placeholder='Student Name'/>
                    <div id='emoji-picker'>
                        {chosenCharacter ? (
                            <span>Student Character: {chosenCharacter.emoji}</span>
                        ) : (
                            <span>Optional: Student Character</span>
                        )}
                        <Picker onEmojiClick={onEmojiClick}/>
                    </div>
                    <br/>
                    <input type="button" value="Add Student" onClick={handleManualAdd}/>
                </form>
            </div>
            <Divider/>
            <div>
                <h3>Upload Roster CSV:</h3>
                <p>CSV should have the following columns: "Name" or "Student", (optional) "Animal"</p>
                <p>Name/Student column should be in the format: "Last, First" or "Last, First Middle"</p>
                <CSVReader
                    ref={buttonRef}
                    onDrop={handleOnDrop}
                    onError={handleOnError}
                    onRemoveFile={handleOnRemoveFile}
                    progressBarColor={"#5BABDE"}
                    noDrag
                    config={{
                        header: true,
                        transformHeader: function (h) {
                            let header = h.toLowerCase();
                            if (header === 'student' || header === ['student name']) header = 'name';
                            return header
                        }
                    }}
                    addRemoveButton
                >
                    <span>Click to upload your roster.</span>
                </CSVReader>
                <br/>
                {uploadedRoster.length > 0 ?
                    <div>
                        <Table
                            dataSource={tableData}
                            columns={columns}
                            size='small'
                            title={() => 'Review your uploaded roster:'}
                        />
                        <input type='button' value='Add Students' onClick={(e) => {
                            handleRemoveFile(e);
                            handleCsvAdd(e);
                        }}/>
                    </div>
                    : null}
            </div>
        </div>
    );
}