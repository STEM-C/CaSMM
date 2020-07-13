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
                    <a href='#' id='link'>
                        <i className="fa fa-plus-square"/>
                    </a> : null}
                {addUserActive ?
                    <a href='#' id='link'>
                        <i className="fa fa-user-plus"/>
                    </a> : null}
                {cardViewActive ?
                    <a href='#' id='link'>
                        <i className="fa fa-th"/>
                    </a> : null}
                {listViewActive ?
                    <a href='#' id='link'>
                        <i className="fa fa-list-alt"/>
                    </a> : null}
                <a href='#' onClick={handleLogout} id='link'>
                    <i className="fa fa-sign-out-alt"/>
                </a>
                </span>
        </div>
    )
}
