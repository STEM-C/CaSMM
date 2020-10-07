import React, {useState, useEffect} from 'react';

import {Button, Tabs, Table} from 'antd'
import Navbar from '../../components/NavBar/NavBar'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor'
import UnitCreator from './UnitCreator/UnitCreator';
import viewDayModal from './viewDayModal/viewDayModal'
import {getLearningStandard, getLearningStandardcount, getLearningStandardAll} from '../../Utils/requests'
import ViewDayModal from './viewDayModal/viewDayModal';

const {TabPane} = Tabs;

export default function ContentCreator(props){


    const [dataSource, setDataSource] = useState([])
    const [days, setDays] = useState([])
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
            render: (_, key) => (
                <ViewDayModal days={getDays(key)} llinkBtn={true}/>
            )
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            width: '10%',
            align: 'right',
            render: (_, key) => (
                <DayEditor days = {getDays(key)} learningStandard={key.edit-1}  linkBtn={true}/>
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


    const getDays = (i) =>{
        //console.log(i.edit)
        const day1 = []
        //console.log(i)
        const request = getLearningStandard(i.edit-1);
        //console.log(request)
        var i = 1;
        //console.log(request)
        request.then(function(result){
            //console.log(result.data.days)
            result.data.days.forEach(el => {
                day1.push({
                    id: el.id,
                    day: i
                })
                i++;
                //console.log(day1)
            });
            //console.log(day1)
        })
        
        return day1;

    }

    const axiosCall = () =>{
        
       const reqCount = getLearningStandardcount();
     
            const allreq = getLearningStandardAll();
            //console.log(allreq)
            allreq.then(function(allres1){
               
                for(var i=0;i<allres1.data.length;i++){
                
                    const request = getLearningStandard(i+1);
                    request.then(function(result){
                        const value = {
                            name: result.data.name,
                            unit: result.data.unit.name,
                            description: result.data.expectations.length > 5 ? result.data.expectations.substring(0,30) + "..." : result.data.expectations,
                            view: i+1,
                            edit: i+1,
                            delete: 'delete'
                        }
                        setDataSource([...dataSource, value])
                })
          
                }
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




