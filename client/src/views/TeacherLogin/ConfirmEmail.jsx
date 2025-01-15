import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { confirmEmail } from '../../Utils/requests';
import NavBar from '../../components/NavBar/NavBar';
import './Sorry.less';


export default function ConfirmEmail() {
    const search = useLocation().search;
    const [code, setCode] = useState(null);
    const {confirmationCode} = useParams();
    useEffect(() => {

      setCode(confirmationCode);  // Store the code in state
      //console.log(confirmationCode);  // Debug: Check if the code is extracted correctly

      // If a code exists, make the API call
      if (confirmationCode) {
          confirmEmail(confirmationCode)
              .then((response) => {
                  console.log(response);
              })
              .catch((error) => {
                  console.error("Error confirming email:", error);
              });
      }
  }, [search]); // Only trigger when the search string changes
    return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Thank you for confirming!</h1>

      </div>
    </div>
  );
}