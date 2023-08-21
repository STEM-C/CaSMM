import { Modal, Button } from "antd"
import React, { useState } from "react"

export default function DisplayDiagramModal(props) {
  const [visible, setVisible] = useState(false)
  const { image } = props
  const [hover, setHover] = useState(false)
  const showModal = () => {
    setVisible(true)
  }
  const onHover = () => {
    setHover(true)
  }
  const onLeave = () => {
    setHover(false)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    setVisible(false)
  }

  const links = new String(image)
  let items = links.split("\n").filter(item => item != "" || item != " ")
  let width = items.length * 700
  return (
    <div
      id="display-diagram-modal"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {hover ? <div className="popup ModalCompile">Diagrams</div> : ""}
      <Button id="link">
        <svg
          width="25"
          height="20px"
          viewBox="0 -3.8 20 20"
          version="1.1"
          fill="none"
          onClick={showModal}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs></defs>
          <g
            id="image"
            stroke="none"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-380.000000, -3881.000000)"
              fill="#000000"
            >
              <g id="image" transform="translate(56.000000, 160.000000)">
                <path
                  d="M336,3725.5 C336,3724.948 336.448,3724.5 337,3724.5 C337.552,3724.5 338,3724.948 338,3725.5 C338,3726.052 337.552,3726.5 337,3726.5 C336.448,3726.5 336,3726.052 336,3725.5 L336,3725.5 Z M340,3733 L328,3733 L332.518,3726.812 L335.354,3730.625 L336.75,3728.75 L340,3733 Z M326,3735 L342,3735 L342,3723 L326,3723 L326,3735 Z M324,3737 L344,3737 L344,3721 L324,3721 L324,3737 Z"
                  id="image_picture-[#972]"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </Button>
      <Modal
        title={"Diagrams"}
        visible={visible}
        onCancel={handleCancel}
        width={width}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div id="code-display-text">
          {items.map(src => (
            
            <img
            key={src}
              src={src}
              display="block"
              position="relative"
              alt=""
              width="auto"
              height="300"
            />
          ))}
        </div>
      </Modal>
    </div>
  )
}