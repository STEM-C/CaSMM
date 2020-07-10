import {useEffect} from "react";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";

export default function Roster(props) {
    const [tableData, setTableData] = useState([]);
    const {classroomId} = props;

    useEffect( () => {
        getClassroom(classroomId, getToken()).then(classroom => {
            classroom.students.forEach(student => {
                data.push({
                    key: student.id,
                    name: student.name,
                    animal: student.animal,
                    actions: {
                        id: student.id,
                    }
                })
            });
        });
        setTableData(data);
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
        },
        {
            title: 'Animal',
            dataIndex: 'animal',
            key: 'animal',
            align: 'right',
            sorter: {
                compare: (a, b) => a.session < b.session ? -1 : 1,
                multiple: 1
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: 'right',
            render: (active) => (
                <>
                    <a href='#'>View</a>
                    <a href='#'>Edit</a>
                    <a href='#'>Remove</a>
                </>
            )
        }
    ];

    return (
        <div className="container">
            <h1>Classroom X</h1>
            <h2>Your Students:</h2>
            <div id='table-container'>
                <Table columns={columns} dataSource={tableData}/>
            </div>
        </div>
    )
}