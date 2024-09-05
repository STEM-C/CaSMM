import {React, useEffect, useState} from "react"
import NavBar from "../../components/NavBar/NavBar"
import "./form.less"
import { getSupers } from "../../Utils/AuthRequests"
import { sendEmailConfirmationEmail, getStudentClassroom } from "../../Utils/requests"


export default function Form(props) {
  const superEmails = []
  const[formcode, setFormCode] = useState('')


  useEffect ( () => { 

    getStudentClassroom()
      .then((response) => {
        //console.log(response.data.classroom.form)
        setFormCode(`${response.data.classroom.form}?embedded=true`)

        //console.log(`${response.data.classroom.form}`)
      })

  }, [])



  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <iframe
            src={formcode}
            width="100%"
            height="100%"
            height='500px'
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Google Form"
        >
            Loading…
        </iframe>

      </div>
    </div>
  )
}
