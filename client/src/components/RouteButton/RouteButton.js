import React, { useState } from "react";
import {Link } from "react-router-dom";
import './RouteButton.less'

export default function RouteButton(props) {

  const [id] = useState(props.id)
  const [link] = useState(props.link)
  const [size] = useState(props.size);
  const [variant] = useState(props.variant);
  
  return (
    <Link to={`${link}`}>
        <button id={`${id}`} className={`btn-${variant} btn-${size}`} type="submit">{props.children}</button>
    </Link>
  );
}