import React from 'react';
import { useLocation } from 'react-router-dom';
import { confirmEmail } from '../../Utils/requests';
import NavBar from '../../components/NavBar/NavBar';
import "./Sorry.less";

export default function ConfirmEmail() {
    const search = useLocation().search;
    const code = new URLSearchParams(search).get('confirmation');
    confirmEmail(code)
        .then((response) => {
            console.log(response);
        });
    return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Thank you for confirming!</h1>

      </div>
    </div>
  );
}