import React from 'react';

function CheckMark({setHoverCheck, handleCheck}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      align='center'
      viewBox='0 -3 25 25'
      width="30"
      height="30"
      fill="green"
      onMouseEnter={() => setHoverCheck(true)}
      onMouseLeave={() => setHoverCheck(false)}
      onClick={handleCheck}
    >
      <path d="M9 19.4l-7.4-7.4 2.8-2.8L9 14.8l10.6-10.6L22.4 7z" />
    </svg>
  );
}

export default CheckMark;