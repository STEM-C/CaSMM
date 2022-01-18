import React from 'react';
import { Link } from 'react-router-dom';
import './RouteButton.less';

export default function RouteButton({ link, id, size, variant, children }) {
  return (
    <Link to={link}>
      <button id={id} className={`btn-${variant} btn-${size}`} type='button'>
        {children}
      </button>
    </Link>
  );
}
