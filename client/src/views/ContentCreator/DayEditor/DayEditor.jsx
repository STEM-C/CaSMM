import { Button, Card, Form, List, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  createDay,
  deleteDay,
  getLearningStandardDays,
} from "../../../Utils/requests"
import DayDetailModal from "./components/DayDetailModal"
import "./DayEditor.less"

const DayEditor = ({ learningStandard, viewing, setViewing, page, tab }) => {
  const [visible, setVisible] = useState(false)
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false)
  const [days, setDays] = useState([])
  const [selectDay, setSelectDay] = useState("")
  // eslint-disable-next-line
  const [_, setSearchParams] = useSearchParams()

  const showDayDetailsModal = async dayObj => {
    setDayDetailsVisible(true)
    setSelectDay(dayObj)
  }

  useEffect(() => {
    const getSavedDay = async () => {
      if (viewing && viewing === learningStandard.id) {
        const getDayAll = await getLearningStandardDays(viewing)
        const myDays = getDayAll.data
        myDays.sort((a, b) => (a.number > b.number ? 1 : -1))
        setDays([...myDays])
        //console.log("relevant dataa: ", myDays)
        setVisible(true)
      }
    }
    getSavedDay()
  }, [viewing, learningStandard.id])

  const addBasicDay = async () => {
    let newDay = 1
    if (days.length !== 0) {
      newDay = parseInt(days[days.length - 1].number) + 1
    }

    const response = await createDay(newDay, learningStandard.id)
    if (response.err) {
      message.error(response.err)
    }
    setDays([...days, response.data])
  }

  const removeBasicDay = async currDay => {
    if (window.confirm(`Deleting Day ${currDay.number}`)) {
      const response = await deleteDay(currDay.id)
      if (response.err) {
        message.error(response.err)
      }

      const getDayAll = await getLearningStandardDays(learningStandard.id)
      if (getDayAll.err) {
        message.error(getDayAll.err)
      }
      setDays([...getDayAll.data])
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setViewing(undefined)
    setSearchParams({ tab, page })
  }

  return (
    <div>
      <Modal
        title={learningStandard.name}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        size="large"
      >
        <div className="list-position">
          {days.length > 0 ? (
            <div>
              <p id="day-editor-subtitle">
                Click on a <strong>Day</strong> to edit details and workspace
              </p>
              <List
                grid={{ gutter: 16, column: 3 }}
                style={{ marginTop: "2vh" }}
                dataSource={days}
                renderItem={item => (
                  <List.Item>
                    <Card
                      id="card-day"
                      key={item.id}
                      title={"Day " + item.number}
                      hoverable="true"
                      style={item.description ? { background: "#a6ffb3" } : {}}
                      onClick={() => showDayDetailsModal(item)}
                    />
                    <span
                      className="delete-btn"
                      onClick={() => removeBasicDay(item)}
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
                  onClick={addBasicDay}
                  type="primary"
                  size="large"
                  className="content-creator-button"
                >
                  Add Day
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

export default DayEditor
