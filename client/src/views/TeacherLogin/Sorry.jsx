import {React, useEffect} from "react"
import NavBar from "../../components/NavBar/NavBar"
import "./Sorry.less"
import { getSupers } from "../../Utils/AuthRequests"
import { sendEmailConfirmationEmail } from "../../Utils/requests"


export default function Sorry(props) {
  const superEmails = []
  const myUser = JSON.parse(sessionStorage.user)

  useEffect( () => {

    console.log(myUser)
    getSupers()
      .then(response => {
        //console.log(response.data)
        for (var i = 0; i < response.data.length; i++){
          if (response.data[i].isActive) {
            superEmails.push(response.data[i].email);
          };
        //console.log(superEmails)
        };
      })

  }, [])

    const resendEmail = () => {
      for (var i = 0; i < superEmails.length; i++){
        sendEmailConfirmationEmail(myUser.email, superEmails[i])
          .then(response => {
            //console.log('hihihi');
          })
      }
    }

  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Hey! Looks like your account is not confirmed. Please ask a "STRAPI SUPER ADMIN" to
        check their email for a confirmation code.</h1>
        <h2>If you wish to resend a confirmation email, click <a href='#' onClick={resendEmail}>here</a></h2>

      </div>
    </div>
  )
}
