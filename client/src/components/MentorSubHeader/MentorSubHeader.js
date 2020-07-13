import React from 'react';
import './MentorSubHeader.less'
import {Link} from "react-router-dom";

export default function MentorSubHeader(props) {
    const {
        title,
        toDashActive,
        addActivityActive,
        addUserActive,
        cardViewActive,
        listViewActive,
        setListView,
        handleLogout
    } = props;

    return (
        <div id='page-header'>
            <h1>{title}</h1>
            <span id='header-nav'>
                {toDashActive ?
                    <Link id='link' to={"/dashboard"}>
                        <i className="fa fa-home"/>
                    </Link> : null}
                {addActivityActive ?
                    <button id='link'>
                        <i className="fa fa-plus-square"/>
                    </button> : null}
                {addUserActive ?
                    <button id='link'>
                        <i className="fa fa-user-plus"/>
                    </button> : null}
                {cardViewActive ?
                    <button onClick={() => setListView(false)} id='link'>
                        <i className="fa fa-th"/>
                    </button> : null}
                {listViewActive ?
                    <button onClick={() => setListView(true)} id='link'>
                        <i className="fa fa-list-alt"/>
                    </button> : null}
                <button onClick={handleLogout} id='link'>
                    <i className="fa fa-sign-out-alt"/>
                </button>
            </span>
        </div>
    )
}
