import React, { useState, useEffect } from 'react';

import { Tabs, Table, Popconfirm, message } from 'antd'
import Navbar from '../../components/NavBar/NavBar'
import { QuestionCircleOutlined } from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor'
import UnitCreator from './UnitCreator/UnitCreator';
import LearningStandardDayCreator from './LearningStandardCreator/LearningStandardCreator'
import {getLearningStandard, getLearningStandardAll,deleteLearningStandard, getGrades, getUnits, getAllUnits} from '../../Utils/requests'
import ViewDayModal from './viewDayModal/viewDayModal';
import UnitEditor from './UnitEditor/UnitEditor'

const { TabPane } = Tabs;

export default function ContentCreator(props) {

    const [dataSource, setDataSource] = useState([])
    const [dataSourceGrade5, setDataSourceGrade5] = useState([])
    const [dataSourceGrade6, setDataSourceGrade6] = useState([])
    const [gradeMenu, setGradeMenu] = useState([])

    useEffect(() => {
        //console.log(getLearningStandardcount())
        getGrades().then(res => {
            if(res.data){
                setGradeMenu(res.data)
                console.log("this is the grade menu", gradeMenu)
            }else{
                message.error(res.err)
            }
        })
        axiosCallAll()
        axiosCallgrade(4)
    }, [])



    const columns = [
        {
            title: 'Learning Standard',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '22.5%',
            align: 'left',
            render: (_, key) => (
                <DayEditor history={props.history} days = {getDays(key)} learningStandardId={key.id} learningStandardName={key.name} linkBtn={true}/>
            )
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            editable: true,
            width: '22.5%',
            align: 'left',
            render: (_, key) => (
                <UnitEditor days={getDays(key)} learningStandard={key.id} linkBtn={true}/>
            )
        },
        // {
        //     title: 'Edit',
        //     dataIndex: 'edit',
        //     key: 'edit',
        //     width: '10%',
        //     align: 'right',
        //     render: (_, key) => (
        //         <UnitEditor days={getDays(key)} learningStandard={key.edit} linkBtn={true}/>
        //     )
        // },
        {
            title: 'Desciption',
            dataIndex: 'description',
            key: 'character',
            editable: true,
            width: '22.5%',
            align: 'left',
        },
        // {
        //     title: 'View',
        //     dataIndex: 'view',
        //     key: 'view',
        //     width: '10%',
        //     align: 'right',
        //     render: (_, key) => (
        //         <DayEditor history={props.history} days = {getDays(key)} learningStandardId={key.edit} learningStandardName = {getLearningStandardName(key.edit)} linkBtn={true}/>
        //     )
        // },
        // {
        //     title: 'Edit',
        //     dataIndex: 'edit',
        //     key: 'edit',
        //     width: '10%',
        //     align: 'right',
        //     render: (_, key) => (
        //         <DayEditor history={props.history} days = {getDays(key)} learningStandard={key.edit} linkBtn={true}/>
        //     )
        // },
        // {
        //     title: 'Edit',
        //     dataIndex: 'edit',
        //     key: 'edit',
        //     width: '10%',
        //     align: 'right',
        //     render: (_, key) => (
        //         <DayEditor days={getDays(key)} learningStandard={key.edit} linkBtn={true}/>
        //     )
        // },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            width: '10%',
            align: 'right',
            render: (_, key) => (
                <Popconfirm title={"Are you sure you want to delete this learning standard?"}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
                            onConfirm={() => {
                                deleteLearningStandard(key.delete);
                                handleRemoveItem(key.delete);
                            }}
                >
                    <button id={'link-btn'}>Delete</button>
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
        setDataSource(dataSource.filter(item => item.delete !== id1))
    }


    const getLearningStandardName = (id) => {
        console.log("magu")
        const returnData = []
        const res = getLearningStandard(id);
        res.then((result) => {
            returnData.push(result.data.name);
        })

        
        // request.then( (result) => { 
        //     console.log("result  : " + result)
        //     res = result.data.name})    
        console.log("Std : ",returnData)
        return returnData;
        
    }

    const getDays = (i) => {
        //console.log(i.edit)
        const day1 = []
        //console.log(i)
        const request = getLearningStandard(i.id);
        //console.log(request)
        // var j = 1;
        //console.log(request)
        request.then(function (result) {
            //console.log(result)
            //console.log(result.data.days)
            // result.data.days.forEach(el => {
            //     day1.push({
            //         id: el.id,
            //         number: el.number,
            //         // day: j,
            //         // template: el.template                    
            //     })
            //     // j++;
            //     //console.log(day1)
            // });
            day1.push(...result.data.days)
            
        })
        console.log("Day ",day1)
        return day1;
    }


    
    const axiosCallAll = async() =>{
        const newArr=[]
        const allreq = getLearningStandardAll();
        //console.log(allreq)
        const allres1 = await allreq
        allres1.data.forEach(learningStand => {
            getTempStandard(learningStand, newArr)
        })

    }

    const axiosCallgrade = async(grade) =>{
        setDataSource([])
        const newArr=[]
        const allreq = getLearningStandardAll();
        //console.log(allreq)
        const allres1 = await allreq 
        allres1.data.forEach(learningStand=>{
            getTempStandardGrade(learningStand,newArr,grade)
        })
    }

    const getTempStandardGrade = async(learningStand, newArr, grade)=>{

        const request = getLearningStandard(learningStand.id);
        const result = await request;
        console.log(result,result.data.unit.grade ,grade)
        if(result.data.unit.grade === grade){
            const value = {
                name: result.data.name,
                unit: result.data.unit.name,
                description: result.data.expectations.length > 5 ? result.data.expectations.substring(0,40) + "..." : result.data.expectations,
                id: learningStand.id,
                delete: learningStand.id
            }
            newArr.push(value)
            // console.log(newArr)
            // console.log(value)
            if(grade === 4){
                setDataSourceGrade5(dataSourceGrade5.concat(newArr))
            }
            else{
                setDataSourceGrade6(dataSourceGrade6.concat(newArr))
            }
        }
        
    }

    const getTempStandard = async(learningStand, newArr)=>{

        const request = getLearningStandard(learningStand.id);
        const result = await request;
        console.log(result)
        
        const value = {
            name: result.data.name,
            unit: result.data.unit.name,
            description: result.data.expectations.length > 5 ? result.data.expectations.substring(0, 30) + "..." : result.data.expectations,
            view: learningStand.id,
            id: learningStand.id,
            delete: learningStand.id
        }
        newArr.push(value)
        // console.log(newArr)
        // console.log(value)
        setDataSource(dataSource.concat(newArr))

    }

    const addTodataSource = (val) => {
        setDataSource(dataSource.concat(val));
    }


    return (
        <div className="container nav-padding">

            <Navbar isContentCreator={true}/>
            <div id='main-header'>Welcome Content Creator</div>

            {/* <div className= "search-button">
            <Button type="primary" icon={<SearchOutlined />}>
                Search
            </Button>
        </div> */}
    
        <Tabs>
             <TabPane tab="Home" key="home">
                <div id="page-header">
                    <h1>Learning Standards & Units:</h1>
                    </div>
                    <div id='table-container'>
                    <UnitCreator datasource={dataSource} changeDataSource={addTodataSource} gradeMenu={gradeMenu}></UnitCreator>
                    <LearningStandardDayCreator dataSource = {dataSource} changeDataSource={addTodataSource} ></LearningStandardDayCreator>
                    <Table columns={columns}  dataSource={dataSource} rowClassName="editable-row">
                </Table>
            </div>
                </TabPane>
            <TabPane tab="5th" key="5th">
                    <div id="page-header">
                            <h1>Learning Standards & Units:</h1>
                    </div>
                    <div id='table-container'>
                        <UnitCreator datasource={dataSource} changeDataSource={addTodataSource} gradeMenu={gradeMenu}></UnitCreator>
                        <LearningStandardDayCreator dataSource = {dataSourceGrade5} changeDataSource={addTodataSource}></LearningStandardDayCreator>
                        <Table columns={columns}  dataSource={dataSourceGrade5} rowClassName="editable-row">
                        </Table>
                    </div>
                </TabPane>
            <TabPane tab="6th" key="6th">
            <div id="page-header">
                            <h1>Learning Standards & Units:</h1>
                    </div>
                    <div id='table-container'>
                        <UnitCreator datasource={dataSource} changeDataSource={addTodataSource} gradeMenu={gradeMenu}></UnitCreator>
                        <LearningStandardDayCreator dataSource = {dataSourceGrade6} changeDataSource={addTodataSource}></LearningStandardDayCreator>
                        <Table columns={columns}  dataSource={dataSourceGrade6} rowClassName="editable-row">
                        </Table>
                    </div>
            </TabPane>
        </Tabs>
        </div>
    )

}




