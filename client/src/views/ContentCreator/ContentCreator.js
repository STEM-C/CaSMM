import React, {useState, useEffect} from 'react';

import {Button, Tabs, Table} from 'antd'
import Navbar from '../../components/NavBar/NavBar'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor'
import UnitCreator from './UnitCreator/UnitCreator';
import viewDayModal from './viewDayModal/viewDayModal'
import {getLearningStandard, getLearningStandardcount} from '../../Utils/requests'
import ViewDayModal from './viewDayModal/viewDayModal';

const {TabPane} = Tabs;

export default function ContentCreator(props){


    const [dataSource, setDataSource] = useState([])
    const [days, setDays] = useState([])
    useEffect(() => {
        console.log(getLearningStandardcount())
        axiosCall()
        getDays()
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '22.5%',
            align: 'left',
            // sorter: {
            //     compare: (a, b) => a.name < b.name ? -1 : 1,
            // }
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            editable: true,
            width: '22.5%',
            align: 'left',
            // sorter: {
            //     compare: (a, b) => a.name < b.name ? -1 : 1,
            // }
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
            render: (_, record) => (
                <ViewDayModal days={days} linkBtn={true}/>
            )
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            width: '10%',
            align: 'right',
            render: (_, record) => (
                <DayEditor days = {days}linkBtn={true}/>
            )
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            width: '10%',
            align: 'right',
            render: (_, record) => (
                <button id={'link-btn'} >Delete</button>
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


   

   
    const addUnitModal= ()=>{
        return(
            <UnitCreator linkBtn={true}></UnitCreator>
        )
    }


    const getDays = () =>{
        //console.log(getLearningStandard(1))
        const request = getLearningStandard(1);
        request.then(function(result){
            //console.log(result.data.days)
            result.data.days.forEach(el => {
                days.push({
                    day: el.id
                })
            });
            console.log(days)
        })
    }

    const axiosCall = () =>{
       const request = getLearningStandard(1);
        request.then(function(result){
            console.log(result.data.days)
            const value = {
                name: result.data.name,
                unit: result.data.unit.name,
                description: result.data.expectations.length > 5 ? result.data.expectations.substring(0,30) + "..." : result.data.expectations,
                view: 'view',
                edit: 'edit',
                delete: 'delete'
            }
            setDataSource([...dataSource, value])
       })
       
    }



    return(
  
        <div className= "container nav-padding">  
        
         
        <Navbar />
        <div id='main-header'>Welcome Content Creator</div>
       
        <div className= "search-button">
            <Button type="primary" icon={<SearchOutlined />}>
                Search
            </Button>
        </div>
    
        <Tabs>
             <TabPane tab="Home" key="home">
                </TabPane>
            </Tabs>
            <div id="page-header">
            <h1>Units & Learning Standards:</h1>
            </div>
            <div id='table-container'>
    
            <UnitCreator ></UnitCreator>
    
            <Table columns={columns}  dataSource={dataSource} rowClassName="editable-row">

            </Table>
            </div>

        </div>
    )
    
}




