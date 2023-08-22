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
import "../../../../../../client/src/views/ContentCreator/DayEditor/DayEditor.less"
import DayComponentTags from "../../../../../../client/src/views/ContentCreator/DayEditor/components/DayComponentTags"

const SCIENCE = 1
const MAKING = 2
const COMPUTATION = 3

const MentorDayDetailModal = ({
  learningStandard,
  selectDay,
  setDays,
  open,
}) => {
  const [description, setDescription] = useState("")
  const [template, setTemplate] = useState("")
  const [activity_template, setActivityTemplate] = useState("")
  const [TekS, setTekS] = useState("")
  const [images, setImages] = useState("")
  const [link, setLink] = useState("")
  const [visible, setVisible] = useState(false);
  const [scienceComponents, setScienceComponents] = useState([])
  const [makingComponents, setMakingComponents] = useState([])
  const [computationComponents, setComputationComponents] = useState([])
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false)
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
      setTemplate(response.data.template)
      setActivityTemplate(response.data.activity_template)
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
  const showModal = () => {
    setVisible(true)
    //setOpen(true)
};
  return (
    <div id="mentoredit">
    <Button id="view-day-button"      
    onClick={showModal} style={{width: '40px',marginRight: "auto"}} >
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
>
<g
            id="link"
            stroke="none"
            fill="none"
          >
            </g>
            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
      </Button>
    <Modal
      title={`${learningStandard.name} - Day ${selectDay.number} - ID ${selectDay.id}`}
      visible={visible}
      onCancel={() => setVisible(false)}
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
            required
            placeholder="Enter description"
          ></Input.TextArea>
        </Form.Item>

        <Form.Item id="form-label" label="TekS">
          <Input
            onChange={e => setTekS(e.target.value)}
            value={TekS}
            className="input"
            required
            placeholder="Enter tekS"
          ></Input>
        </Form.Item>
        <Form.Item id="form-label" label="Table Chart">
          <Input.TextArea
            onChange={e => setImages(e.target.value)}
            value={images}
            className="input"
            placeholder="Enter image URL"
          ></Input.TextArea>
        </Form.Item>
        {/* <Form.Item id="form-label" label="Student Template">
          <Input.TextArea
            onChange={e => setTemplate(e.target.value)}
            value={template}
            //className="input"
            placeholder="Enter code template"
          ></Input.TextArea>
        </Form.Item>
        <Form.Item id="form-label" label="Mentor Template">
          <Input.TextArea
            onChange={e => setActivityTemplate(e.target.value)}
            value={activity_template}
            //className="input"
            placeholder="Enter mentor code template"
          ></Input.TextArea>
        </Form.Item> */}
        <h3 id="subtitle">Lesson Materials</h3>
        <Form.Item id="form-label" label="Classroom Materials">
          <DayComponentTags
            components={scienceComponents}
            setComponents={setScienceComponents}
            colorOffset={1}
          />
        </Form.Item>
        <Form.Item id="form-label" label="Student Materials">
          <DayComponentTags
            components={makingComponents}
            setComponents={setMakingComponents}
            colorOffset={4}
          />
        </Form.Item>
        <Form.Item id="form-label" label="Arduino Components">
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
            Edit Student Template
          </button>
          <button id="save-set-activity-btn" onClick={() => setSubmitButton(2)}>
            Edit Mentor Template
            <br />
            
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
        </Form.Item>
      </Form>
    </Modal>
    </div>
  )
}

export default MentorDayDetailModal