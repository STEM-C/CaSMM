import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTopics, getSchools, getClassrooms } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import { List, ListItem, ListItemText, Collapse, Divider, makeStyles, createStyles } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import './Dashboard.css'

import Header from '../../components/Header.js'

function Dashboard(props) {
    const [activities, setActivities] = useState([])
    const [schools, setSchools] = useState([])
    const [classrooms, setClassrooms] = useState([])
    const [selectedSchool, setSelectedSchool] = useState()
    const user = getUser();


    const classes = useStyles();

    useEffect(() => {
        localStorage.clear()

        getTopics().then(topics => {
            // temporary - put all the activities into one array for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setActivities(activities)
        })
        getSchools().then(schoolArray => {
            setSchools(schoolArray)
        })
    }, [])

    useEffect(() => {
        console.log(selectedSchool)
        if(selectedSchool) {
            getClassrooms(selectedSchool.id).then(classroomArray => {
                setClassrooms(classroomArray)
            })
        }
    }, [selectedSchool])

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    }

    return (
        <div>
            <Header user={user.username} handleLogout={handleLogout}/>

            <List component="nav" disablePadding className={classes.schoolList}>
                <h2 className="cardHeader">School List</h2>
                {
                    schools.map(school => {
                      return(
                          <ListItem button className={classes.menuItem} onClick={() => setSelectedSchool(school)}>
                              <ListItemText primary={school.name} />
                          </ListItem>
                      )
                    })
                }
            </List>



            {/*<div className="cardList">

                {
                    activities.map(activity => {
                        return (
                            <Link to="/workspace" className="cardActivity" key={activity.id} onClick={() => props.setSelectedActivity(activity)}>
                                {activity.name}
                            </Link>
                        );
                    })
                }
            </div>*/}
        </div>
    )
}

const useStyles = makeStyles(theme =>
    createStyles({
        schoolList: {
            background: "grey",
            width: '20%',
        },
        menuItem: {
            width: 240,
        },
        menuList: {
            color: '#97c05c',
            width: '70%'
        },
    }),
)

export default Dashboard;