import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getTopics, getSchools, getClassrooms } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import { List, ListItem, ListItemText, makeStyles, createStyles, Dialog, DialogTitle, DialogContent, Typography, Switch, FormControlLabel, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Close';
import './Dashboard.css'

import Header from '../../components/Header.js'

function Dashboard(props) {
    const [activities, setActivities] = useState([])
    const [schools, setSchools] = useState([])
    const [classrooms, setClassrooms] = useState([])
    const [selectedSchool, setSelectedSchool] = useState("")
    const [selectedSession, setSelectedSession] = useState([])
    const [open, setOpen] = useState(false);
    const user = getUser();
    const didMount = useRef(false);

    const classes = useStyles();

    useEffect(() => {

        getTopics(sessionStorage.getItem('token')).then(topics => {
            // temporary - put all the activities into one array for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setActivities(activities)
        })
        getSchools(sessionStorage.getItem('token')).then(schoolArray => {
            setSchools(schoolArray)
        })
    }, [])

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }

        console.log(selectedSchool)
        if(selectedSchool) {
            getClassrooms(selectedSchool.id, sessionStorage.getItem('token')).then(classroomArray => {
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

            <div className={classes.root}>
                <List component="nav" disablePadding className={classes.schoolList}>
                    <h2>School List</h2>
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

                 <List component="nav" disablePadding className={classes.schoolList}>
                    <h2>Classroom List</h2>
                    {
                        classrooms.map(classroom => {
                            return(
                                <ListItem button className={classes.menuItem} onClick={() => setSelectedSession(classroom.sessions)}>
                                    <ListItemText primary={classroom.name} />
                                </ListItem>
                            )
                        })
                    }
                </List>

                <div className={classes.schoolList}>
                    <h2>Session List</h2>
                    {
                        selectedSession.map(session => {
                            return(
                                <div>
                                    <button type="button" onClick={() => setOpen(true)}> { session.name } </button>
                                    <Dialog
                                        open={open}
                                        onClose={() => setOpen(false)}
                                        aria-labelledby="customized-dialog-title"
                                    >
                                        <DialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
                                            {session.name} <br/>
                                            Join Code: {session.code}
                                        </DialogTitle>
                                        <DialogContent dividers>
                                            <Typography gutterBottom>
                                                Current Students:
                                            </Typography>
                                            <FormControlLabel
                                                control={<Switch checked={selectedSession.active} onChange={selectedSession.active = !selectedSession.active} name="gilad" />}
                                                label="Enable/Disable Activity"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )
                        })
                    }

                </div>

            </div>
        </div>
    )
}

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
          display: 'flex'
        },
        schoolList: {
            background: "grey",
            width: '20%',
        },
        menuItem: {
            width: 240,
        },
        content: {
            background: 'grey',
            width: '60%'
        },
    }),
)

export default Dashboard;