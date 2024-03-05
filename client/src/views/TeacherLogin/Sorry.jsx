import React from "react"
import NavBar from "../../components/NavBar/NavBar"
import "./Sorry.less"

export default function Sorry(props) {
  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Hey! Looks like your account is not confirmed. Please ask a "STRAPI SUPER ADMIN" to
        check their email for a confirmation code.</h1>

      </div>
    </div>
  )
}
