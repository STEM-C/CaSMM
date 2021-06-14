import React, { useState, useEffect } from 'react';

import { Tabs, Table, Popconfirm, message } from 'antd'
import Navbar from '../../components/NavBar/NavBar'
import { QuestionCircleOutlined } from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor'
import UnitCreator from './UnitCreator/UnitCreator';
import LearningStandardDayCreator from './LearningStandardCreator/LearningStandardCreator'
import {getLearningStandard, getLearningStandardAll,deleteLearningStandard, getGrades} from '../../Utils/requests'
import UnitEditor from './UnitEditor/UnitEditor'

const { TabPane } = Tabs;

export default function ContentCreator(props) {

    const [dataSource, setDataSource] = useState([])
    const [dataSourceMap, setDataSourceMap] = useState([])
    const [gradeMenu, setGradeMenu] = useState([])

    useEffect(() => {
        //console.log(getLearningStandardcount())
        getGrades().then(res => {
            if(res.data){
                setGradeMenu(res.data)
                // console.log("this is the grade menu", gradeMenu, res.data)
            }else{
                message.error(res.err)
            }
        })
        axiosCallAll()
        // axiosCallgrade(4)
        // eslint-disable-next-line
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

    const getDays = (i) => {
        const day1 = []
        // console.log(i)

        const request = getLearningStandard(i.id);

        request.then(function (result) {

            day1.push(...result.data.days)
            
        })
        // console.log("Day ",day1)
        return day1;
    }


    
    const axiosCallAll = async() =>{
        const newArr=[]
        const newMap={}
        const allreq = getLearningStandardAll();
        //console.log(allreq)
        const allres1 = await allreq
        console.log("all Learning Standards", allres1)
        allres1.data.forEach(learningStand => {
            const value = {
                name: learningStand.name,
                unit: learningStand.unit.name,
                description: learningStand.expectations.length > 5 ? learningStand.expectations.substring(0, 30) + "..." : learningStand.expectations,
                view: learningStand.id,
                id: learningStand.id,
                delete: learningStand.id
            }
            newArr.push(value)
            newMap[learningStand.unit.grade] = newMap[learningStand.unit.grade] || [];
            newMap[learningStand.unit.grade].push(value);
            
        })
        setDataSource(dataSource.concat(newArr))
        setDataSourceMap(newMap)
    }
    

    const addTodataSource = (val) => {
        setDataSource(dataSource.concat(val));
    }

    const setTabs = (grade) => {

        return (  
            <TabPane tab={grade.name} key={grade.name}>
                    <div id="page-header">
                            <h1>Learning Standards & Units:</h1>
                    </div>
                    <div id='table-container'>
                        <UnitCreator datasource={dataSource} changeDataSource={addTodataSource} gradeMenu={gradeMenu}></UnitCreator>
                        <LearningStandardDayCreator dataSource = {dataSourceMap[grade.id]} changeDataSource={addTodataSource}></LearningStandardDayCreator>
                        <Table columns={columns}  dataSource={dataSourceMap[grade.id]} rowClassName="editable-row">
                        </Table>
                    </div>
                </TabPane>
                )
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
                    <UnitCreator datasource={dataSource} changeDataSource={addTodataSource} gradeMenu={gradeMenu}/>
                    <LearningStandardDayCreator dataSource = {dataSource} changeDataSource={addTodataSource} />
                    <Table columns={columns}  dataSource={dataSource} rowClassName="editable-row">
                </Table>
                </div>
            </TabPane>
            
            {
                gradeMenu.map(grade => {
                    // console.log("logging grades", grade)
                    return setTabs(grade)
                   
                })
            }
                
            
        </Tabs>
        </div>
    )

}




