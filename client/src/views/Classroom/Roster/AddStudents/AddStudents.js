import {Divider, message} from 'antd';
import React, {useState} from "react";
import './AddStudents.less'
import {CSVReader} from 'react-papaparse';
import {Table} from 'antd';
import {addStudent, addStudents} from "../../../../Utils/requests";

export default function AddStudents(props) {
    const name = useFormInput('');
    const animal = useFormInput('');
    const [uploadedRoster, setUploadedRoster] = useState([]);
    const [tableData, setTableData] = useState([]);
    const {classroomId, addStudentsToTable} = props;

    const handleManualAdd = async () => {
        const res = await addStudent(name.value, animal.value, classroomId);
        if (res.data) {
            addStudentsToTable([res.data]);
            message.success(`${name.value} has been added to the roster successfully.`)
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
            message.success('Uploaded roster added to classroom successfully.')
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
        const filteredRoster = roster.filter(student => {
            if (student.data.name && student.data.animal) return true;
            return false
        });

        const students = await filteredRoster.map(student => student.data);
        setUploadedRoster(students);
        const data = await getTableData(students);
        setTableData(data)
    };

    const handleRemoveFile = () => {
        // clear uploadedRoster and tableData when file is unselected
        setUploadedRoster([]);
        setTableData([]);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.error(err);
        message.error("Failed to parse the uploaded file.")
    };

    return (
        <div id='add-students'>
            <div id='manual-input'>
                <h3>Manual Input:</h3>
                <form>
                    {/*<label htmlFor="name">Name:</label><br/>*/}
                    <input type="text" {...name} id="name" name="name" placeholder='Student Name'/>
                    {/*<label htmlFor="animal">Animal:</label><br/>*/}
                    <input type="text" {...animal} id="animal" name="animal" placeholder='Student Animal'/>
                    <br/>
                    <input type="button" value="Add Student" onClick={handleManualAdd}/>
                </form>
            </div>
            <Divider/>
            <div>
                <h3>Upload Roster CSV:</h3>
                <p>CSV should have the following columns: "Name", "Animal"</p>
                <CSVReader
                    onDrop={handleOnDrop}
                    onError={handleOnError}
                    onRemoveFile={handleRemoveFile}
                    progressBarColor={"#5BABDE"}
                    noDrag
                    config={{
                        header: true,
                        transformHeader: function (h) {
                            return h.toLowerCase();
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
                        <input type='button' value='Add Students' onClick={handleCsvAdd}/>
                    </div>
                    : null}
            </div>
        </div>
    );
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    };
    return {
        value,
        onChange: handleChange
    }
};