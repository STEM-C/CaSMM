import React from 'react';
import './MentorSubHeader.less'
import {Link} from "react-router-dom";
import AddStudentsModal from "../../views/Classroom/Roster/AddStudents/AddStudentsModal";

export default function MentorSubHeader(props) {
    const {
        title,
        addActivityActive,
        addUserActive,
        cardViewActive,
        listViewActive,
        checkoutActive,
        setListView,
    } = props;

    return (
        <div id='page-header'>
            <h1>{title}</h1>
            <span id='header-nav'>
                {addActivityActive ?
                    <button id='link'>
                        <i className="fa fa-plus-square"/>
                    </button> : null}
                {addUserActive ?
                    <AddStudentsModal/> : null}
                {cardViewActive ?
                    <button onClick={() => setListView(false)} id='link'>
                        <i className="fa fa-th"/>
                    </button> : null}
                {listViewActive ?
                    <button onClick={() => setListView(true)} id='link'>
                        <i className="fa fa-list-alt"/>
                    </button> : null}
                {checkoutActive ?
                    <Link id='link' to={"/dashboard"}>
                        <i className="fa fa-shopping-cart"/>
                    </Link> : null}
            </span>
        </div>
    )
}
