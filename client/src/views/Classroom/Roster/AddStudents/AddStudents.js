import {Divider} from 'antd';
import React, {useState} from "react";
import {CSVReader} from 'react-papaparse';
import {Table} from 'antd';

export default function AddStudents(props) {
    const [uploadedRoster, setUploadedRoster] = useState([]);
    const [tableData, setTableData] = useState([])

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
                name: student.Name,
                animal: student.Animal
            }
        });
        console.log(tableData);
        return tableData
    };

    const handleOnDrop = async (roster) => {
        console.log('---------------------------');
        console.log(roster);
        console.log('---------------------------');

        const filteredRoster = roster.filter(student => {
            if (student.data.Name && student.data.Animal) return true
        });

        const students = await filteredRoster.map(student => student.data);
        setUploadedRoster(students);
        const data = await getTableData(students);
        setTableData(data)
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    };

    return (
        <div>
            <div>
                <h3>Manual Input:</h3>
                <form onSubmit={() => {
                }}>
                    <label htmlFor="name">Name:</label><br/>
                    <input type="text" id="name" name="name" placeholder='Student Name'/><br/>
                    <label htmlFor="animal">Animal:</label><br/>
                    <input type="text" id="animal" name="animal" placeholder='Student Animal'/><br/><br/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <Divider/>
            <div>
                <h3>Upload Roster CSV:</h3>
                <p>CSV should be in format:</p>
                <p>Column 1: "Name", Column 2: "Animal"</p>
                <CSVReader
                    onDrop={handleOnDrop}
                    onError={handleOnError}
                    progressBarColor={"#5BABDE"}
                    noDrag
                    config={{header: true}}
                    addRemoveButton
                >
                    <span>Click to upload your roster.</span>
                </CSVReader>
                <br/>
                {uploadedRoster.length > 0 ?
                    <div>
                        <h4>Review uploaded roster:</h4>
                        <Table
                            dataSource={tableData}
                            columns={columns}
                            size='small'
                        />
                    </div> : null}
            </div>
        </div>
    );
}