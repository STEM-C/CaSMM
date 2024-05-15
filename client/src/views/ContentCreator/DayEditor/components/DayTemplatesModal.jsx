import { Button, Card, Form, List, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  createDay,
  deleteDay,
  getLearningStandardDays,
  getDay,
  updateDayDetails,
  getDayToolbox,
  getDayToolboxAll,
  createCCWorkspace,
  updateDayMultiTemplateDetails,
  deleteCCWorkspace,
  updateCCWorkspace,
} from "../../../../Utils/requests"
import DayDetailModal from "./DayDetailModal"
import "../DayEditor.less"

const DayTemplates = ({ thisDay, viewing, setViewing, learningStandard  }) => {
  const [visible, setVisible] = useState(false)
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false)
  const [days, setDays] = useState([])
  const [selectDay, setSelectDay] = useState("")
  const [submitButton, setSubmitButton] = useState(0)
  // eslint-disable-next-line
  const [_, setSearchParams] = useSearchParams()
  const navigate = useNavigate();
  

  const showDayDetailsModal = async dayObj => {
    setDayDetailsVisible(true)
    setSelectDay(dayObj)
  }
 
  useEffect(() => {
    //console.log("day we are on: ", thisDay);
    setVisible(true);
    getDay(thisDay)
      .then(response => {
        const myDays = response.data
        //console.log("USE EFFECT HERE")
        setDays([myDays])
        //console.log(response.data)
        if (response.data.template == 'copied'){

        }
        else if ((response.data.multi_template.length == 0)) {
          //console.log('hello')
          createCCWorkspace(`Day ${response.data.id} Template ${1} `, '', `${response.data.template}`, [], '')
          .then(creation => {
            updateDayMultiTemplateDetails(response.data.id, creation.data)
            .then(another_day => {
              const dd = another_day.data
              dd.template = 'copied'
              setDays([dd])
            })
          })
         }

      })


    
  }, [])
  

  const addBasicTemplate = async (template_count) => {
    let newDay = 1
    if (days.length !== 0) {
      //newDay = parseInt(days[0].multi_template[days[0].multi_template.length - 1]) + 1
    }

    const response = await createCCWorkspace(`Day ${days[0].id} Template ${template_count+1} `, '', '', [], '')
    const shallow_copy = [...days]
    shallow_copy[0].multi_template = [...shallow_copy[0].multi_template, response.data]
    console.log(shallow_copy)
    if (response.err) {
      message.error(response.err)
    }
    setDays([...shallow_copy])
    console.log(days[0].multi_template)
    const diditwork = await updateDayMultiTemplateDetails(shallow_copy[0].id, shallow_copy[0].multi_template)
    if (diditwork.err) {
      message.error(diditwork.err)

    }
  }
  

  const removeNewTemplate = async currDay => {
    if (window.confirm(`Deleting CCWorkspace ${currDay.id}`)) {
      const response = await deleteCCWorkspace(currDay.id)
      if (response.err) {
        message.error(response.err)
      }

      const getDayAll = await getDay(days[0].id)
      console.log(getDayAll)
      if (getDayAll.err) {
        message.error(getDayAll.err)
      }
      setDays([getDayAll.data])

      }
    }
  

  const handleCancel = () => {
    setVisible(false)
    setViewing(undefined)
    //setSearchParams({ tab, page })
  }

  const handleViewDayTemplate = async (day, index) => {
    const allToolBoxRes = await getDayToolboxAll()
    const selectedToolBoxRes = await getDayToolbox(day.id)
    day.selectedToolbox = selectedToolBoxRes.data.toolbox
    day.toolbox = allToolBoxRes.data.toolbox
    day.template = day.multi_template[index].template
    //console.log(day)
    day.learning_standard_name = learningStandard.name
    localStorage.setItem("my-day", JSON.stringify(day))
    localStorage.setItem("multi_number", parseInt(index) )

    navigate("/day")
  }

  const handleViewActivityTemplate = async day => {
    const allToolBoxRes = await getDayToolboxAll()
    delete day.selectedToolbox
    day.toolbox = allToolBoxRes.data.toolbox

    //day.learning_standard_name = learningStandard.name
    localStorage.setItem("my-day", JSON.stringify(day))
    navigate("/day")
  }


    const handleTemplateClick = async () => {
      setSubmitButton(1)
    }
  //console.log("local storage" , localStorage)

  

  return (
    <div>
      <Modal
        title={`Select Template for Day`}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        size="large"
      >
        <div className="list-position">
          {days.length > 0 ? (
            <div>
              <p id="day-editor-subtitle">
                Click on a <strong>Template</strong> to edit workspace
              </p>
              <List
                grid={{ gutter: 16, column: 3 }}
                style={{ marginTop: "2vh" }}
                dataSource={days[0].multi_template}
                renderItem={(item, index) => (
                  <List.Item>
                    <Card
                      id="card-day"
                      key={item.id}
                      title={"Template " + (index + 1)}
                      hoverable="true"
                      style={item.template ? { background: "#a6ffb3" } : {}}
                      onClick={() => handleViewDayTemplate(days[0], index)}
                    />
                    <span
                      className="delete-btn"
                      onClick={() => removeNewTemplate(item)}
                    >
                      &times;
                    </span>
                  </List.Item>
                )}
              />
            </div>
          ) : null}
          <div>
            <Form
              id="add-day"
              wrapperCol={{
                span: 14,
              }}
              layout="horizontal"
              size="default"
            >
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
                style={{ marginBottom: "0px" }}
              >
                <Button
                  onClick={() => addBasicTemplate(days[0].multi_template.length)}
                  type="primary"
                  size="large"
                  className="content-creator-button"
                >
                  Add Template
                </Button>
                <Button
                  onClick={handleCancel}
                  size="large"
                  className="content-creator-button"
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      {dayDetailsVisible && (
        <DayDetailModal
          learningStandard={learningStandard}
          selectDay={selectDay}
          dayDetailsVisible={dayDetailsVisible}
          setDayDetailsVisible={setDayDetailsVisible}
          setDays={setDays}
          viewing={viewing}
        />
      )}
    </div>
  )
}

export default DayTemplates
