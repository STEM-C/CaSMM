import { Button, Form, Input, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getDay,
  getDayToolbox,
  getDayToolboxAll,
  getLearningStandardDays,
  updateDayDetails,
} from "../../../../Utils/requests"
import "../DayEditor.less"
import DayComponentTags from "./DayComponentTags"

const SCIENCE = 1
const MAKING = 2
const COMPUTATION = 3

const DayDetailModal = ({
  learningStandard,
  selectDay,
  setDayDetailsVisible,
  setDays,
  viewing,
}) => {
  const [description, setDescription] = useState("")
  //const [template, setTemplate] = useState("")
  const [TekS, setTekS] = useState("")
  const [images, setImages] = useState("")
  const [link, setLink] = useState("")

  const [scienceComponents, setScienceComponents] = useState([])
  const [makingComponents, setMakingComponents] = useState([])
  const [computationComponents, setComputationComponents] = useState([])

  const [linkError, setLinkError] = useState(false)
  const [submitButton, setSubmitButton] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const showDayDetailsModal = async () => {
      const response = await getDay(selectDay.id)
      if (response.err) {
        message.error(response.err)
        return
      }
      setDescription(response.data.description)
      //setTemplate(response.data.template)
      setTekS(response.data.TekS)
      setImages(response.data.images)
      setLink(response.data.link)
      setLinkError(false)
      const science = response.data.learning_components
        .filter(component => component.learning_component_type === SCIENCE)
        .map(element => {
          return element.type
        })
      setScienceComponents(science)

      const making = response.data.learning_components
        .filter(component => component.learning_component_type === MAKING)
        .map(element => {
          return element.type
        })
      setMakingComponents(making)

      const computation = response.data.learning_components
        .filter(component => component.learning_component_type === COMPUTATION)
        .map(element => {
          return element.type
        })
      setComputationComponents(computation)
    }
    showDayDetailsModal()
  }, [selectDay])

  const checkURL = n => {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
    if (n.search(regex) === -1) {
      return null
    }
    return n
  }

  const handleViewDayTemplate = async day => {
    const allToolBoxRes = await getDayToolboxAll()
    const selectedToolBoxRes = await getDayToolbox(day.id)
    day.selectedToolbox = selectedToolBoxRes.data.toolbox
    day.toolbox = allToolBoxRes.data.toolbox

    day.learning_standard_name = learningStandard.name
    localStorage.setItem("my-day", JSON.stringify(day))
    navigate("/day")
  }

  const handleViewActivityTemplate = async day => {
    const allToolBoxRes = await getDayToolboxAll()
    delete day.selectedToolbox
    day.toolbox = allToolBoxRes.data.toolbox

    day.learning_standard_name = learningStandard.name
    localStorage.setItem("my-day", JSON.stringify(day))
    navigate("/day")
  }

  const handleSave = async () => {
    if (link) {
      const goodLink = checkURL(link)
      if (!goodLink) {
        setLinkError(true)
        message.error("Please Enter a valid URL starting with HTTP/HTTPS", 4)
        return
      }
    }
    setLinkError(false)
    const res = await updateDayDetails(
      selectDay.id,
      description,
      //template,
      TekS,
      images,
      link,
      scienceComponents,
      makingComponents,
      computationComponents
    )
    if (res.err) {
      message.error(res.err)
    } else {
      message.success("Successfully saved day")
      // just save the form
      if (submitButton === 0) {
        const getDayAll = await getLearningStandardDays(viewing)
        const myDays = getDayAll.data
        myDays.sort((a, b) => (a.number > b.number ? 1 : -1))
        setDays([...myDays])
        // save the form and go to workspace
      } else if (submitButton === 1) {
        setDayDetailsVisible(false)
        handleViewDayTemplate(res.data)
      } else if (submitButton === 2) {
        setDayDetailsVisible(false)
        handleViewActivityTemplate(res.data)
      }
    }
  }

  return (
    <Modal
      title="Selected Day Details Editor"
      open={true}
      onCancel={() => setDayDetailsVisible(false)}
      footer={null}
      width="45vw"
    >
      <Form
        id="day-detail-editor"
        layout="horizontal"
        size="default"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        onFinish={handleSave}
      >
        <Form.Item id="form-label" label="Description">
          <Input.TextArea
            onChange={e => setDescription(e.target.value)}
            value={description}
            //required
            placeholder="Enter description"
          ></Input.TextArea>
        </Form.Item>
        {/* <Form.Item id="form-label" label="Student Template">
          <Input
            onChange={e => setTemplate(e.target.value)}
            value={template}
            //className="input"
            placeholder="Enter code template"
          ></Input>
        </Form.Item> */}
        <Form.Item id="form-label" label="TekS">
          <Input
            onChange={e => setTekS(e.target.value)}
            value={TekS}
            className="input"
            //required
            placeholder="Enter tekS"
          ></Input>
        </Form.Item>
        <Form.Item id="form-label" label="Images">
          <Input.TextArea
            onChange={e => setImages(e.target.value)}
            value={images}
            className="input"
            placeholder="Enter image URL"
          ></Input.TextArea>
        </Form.Item>
        <h3 id="subtitle">Lesson Learning Components</h3>
        <Form.Item id="form-label" label="Science Component">
          <DayComponentTags
            components={scienceComponents}
            setComponents={setScienceComponents}
            colorOffset={1}
          />
        </Form.Item>
        <Form.Item id="form-label" label="Maker Component">
          <DayComponentTags
            components={makingComponents}
            setComponents={setMakingComponents}
            colorOffset={4}
          />
        </Form.Item>
        <Form.Item id="form-label" label="Computation Component">
          <DayComponentTags
            components={computationComponents}
            setComponents={setComputationComponents}
            colorOffset={7}
          />
        </Form.Item>
        <h3 id="subtitle">Additional Information</h3>
        <Form.Item
          id="form-label"
          label="Link to Additional Resources (Optional)"
        >
          <Input
            onChange={e => {
              setLink(e.target.value)
              setLinkError(false)
            }}
            className="input"
            value={link}
            style={linkError ? { backgroundColor: "#FFCCCC" } : {}}
            placeholder="Enter a link"
          ></Input>
        </Form.Item>
        <Form.Item
          id="form-label"
          wrapperCol={{
            offset: 6,
            span: 30,
          }}
        >
          <button id="save--set-day-btn" onClick={() => setSubmitButton(1)}>
            Save and Set
            <br />
            Day Template
          </button>
          <button id="save-set-activity-btn" onClick={() => setSubmitButton(2)}>
            Save and Set
            <br />
            Activity Template
          </button>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          style={{ marginBottom: "0px" }}
        >
          <Button
            onClick={() => setSubmitButton(0)}
            type="primary"
            htmlType="submit"
            size="large"
            className="content-creator-button"
          >
            Save
          </Button>
          <Button
            onClick={() => setDayDetailsVisible(false)}
            size="large"
            className="content-creator-button"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DayDetailModal
