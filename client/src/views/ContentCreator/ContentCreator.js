import React, {useState, useEffect} from 'react';

import { Tabs, Table, Popconfirm} from 'antd'
import Navbar from '../../components/NavBar/NavBar'
import { QuestionCircleOutlined} from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor'
import UnitCreator from './UnitCreator/UnitCreator';
import {getLearningStandard, getLearningStandardAll,deleteLearningStandard} from '../../Utils/requests'
import ViewDayModal from './viewDayModal/viewDayModal';

const {TabPane} = Tabs;

export default function ContentCreator(props){

    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        //console.log(getLearningStandardcount())
        
        axiosCall()
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '22.5%',
            align: 'left',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            editable: true,
            width: '22.5%',
            align: 'left',
        },
        {
            title: 'Desciption',
            dataIndex: 'description',
            key: 'character',
            editable: true,
            width: '22.5%',
            align: 'left',
        },
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            width: '10%',
            align: 'right',
            render: (_, key) => (
                <ViewDayModal history={props.history} days={getDays(key)} llinkBtn={true}/>
            )
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            width: '10%',
            align: 'right',
            render: (_, key) => (
                <DayEditor days = {getDays(key)} learningStandard={key.edit} linkBtn={true}/>
            )
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            width: '10%',
            align: 'right',
            render: (_, key) => (
                <Popconfirm title={"Are you sure you want to delete this learning standard?"}
                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                onConfirm={()=>{deleteLearningStandard(key.delete);handleRemoveItem(key.delete);}}
                >
                    <button id={'link-btn'} >Delete</button>
                 </Popconfirm> 
            )
            // render: (text, record) =>
            //     studentData.length >= 1 ? (
            //         <Popconfirm
            //             title={`Are you sure you want to delete all data for ${record.name}?`}
            //             icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
            //             onConfirm={() => handleDelete(record.key)}>
            //             <button id='link-btn'> Delete</button>
            //         </Popconfirm>
            //     ) : null,
        }
    ];

    const handleRemoveItem = id1 => {
        setDataSource(dataSource.filter(item=> item.delete !==id1))
    }

    const getDays = (i) =>{
        //console.log(i.edit)
        const day1 = []
        //console.log(i)
        const request = getLearningStandard(i.edit);
        //console.log(request)
        var j = 1;
        //console.log(request)
        request.then(function(result){
            //console.log(result)
            //console.log(result.data.days)
            result.data.days.forEach(el => {
                day1.push({
                    id: el.id,
                    day: j,
                    template: el.template
                })
                j++;
                //console.log(day1)
            });
            //console.log(day1)
        })
        return day1;
    }

    const axiosCall = async() =>{
        const newArr=[]
        const allreq = getLearningStandardAll();
        //console.log(allreq)
        const allres1 = await allreq 
        allres1.data.forEach(learningStand=>{
            getTempStandard(learningStand,newArr)
        })
        
    }

    const getTempStandard = async(learningStand, newArr)=>{

        const request = getLearningStandard(learningStand.id);
        const result = await request;

        const value = {
            name: result.data.name,
            unit: result.data.unit.name,
            description: result.data.expectations.length > 5 ? result.data.expectations.substring(0,30) + "..." : result.data.expectations,
            view: learningStand.id,
            edit: learningStand.id,
            delete: learningStand.id
        }
        newArr.push(value)
        // console.log(newArr)
        // console.log(value)
        setDataSource(dataSource.concat(newArr))

    }

    const addTodataSource = (val)=>{
        setDataSource(dataSource.concat(val));
    }



    return(
  
        <div className= "container nav-padding">  
        
         
        <Navbar />
        <div id='main-header'>Welcome Content Creator</div>
       
        {/* <div className= "search-button">
            <Button type="primary" icon={<SearchOutlined />}>
                Search
            </Button>
        </div> */}
    
        <Tabs>
             <TabPane tab="Home" key="home">
                </TabPane>
            </Tabs>
            <div id="page-header">
            <h1>Units & Learning Standards:</h1>
            </div>
            <div id='table-container'>
    
            <UnitCreator datasource={dataSource} changeDataSource={addTodataSource}></UnitCreator>
    
            <Table columns={columns}  dataSource={dataSource} rowClassName="editable-row">

            </Table>
            </div>

        </div>
    )
    
}



