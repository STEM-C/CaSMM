import { message } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import {
  getCCWorkspaceToolbox,
  getDayToolbox,
  getDayToolboxAll
} from "../../Utils/requests"
import { useGlobalState } from "../../Utils/userState"

export default function BlocklyPage({ isSandbox }) {
  const [value] = useGlobalState("currUser")
  const [day, setDay] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const setup = async () => {
      // if we are in sandbox mode show all toolbox
      const sandboxDay = JSON.parse(localStorage.getItem("sandbox-day"))
      if (isSandbox) {
        const AllToolboxRes = await getDayToolboxAll()
        if (!sandboxDay?.id || value.role === "Mentor") {
          if (AllToolboxRes.data) {
            let loadedDay = {
              ...sandboxDay,
              toolbox: AllToolboxRes.data.toolbox,
            }
            localStorage.setItem("sandbox-day", JSON.stringify(loadedDay))
            setDay(loadedDay)
          } else {
            message.error(AllToolboxRes.err)
          }
        } else if (value.role === "ContentCreator") {
          const res = await getCCWorkspaceToolbox(sandboxDay.id)
          if (res.data) {
            let loadedDay = { ...sandboxDay, selectedToolbox: res.data.toolbox }
            loadedDay = { ...loadedDay, toolbox: AllToolboxRes.data.toolbox }

            localStorage.setItem("sandbox-day", JSON.stringify(loadedDay))
            setDay(loadedDay)
          } else {
            message.error(res.err)
          }
        }
      }
      // else show toolbox based on the day we are viewing
      else {
        const localDay = JSON.parse(localStorage.getItem("my-day"))

        if (localDay) {
          if (localDay.toolbox) {
            setDay(localDay)
          } else {
            const res = await getDayToolbox(localDay.id)
            if (res.data) {
              let loadedDay = { ...localDay, toolbox: res.data.toolbox }

              localStorage.setItem("my-day", JSON.stringify(loadedDay))
              setDay(loadedDay)
            } else {
              message.error(res.err)
            }
          }
        } else {
          navigate(-1)
        }
      }
    }

    setup()
  }, [isSandbox, navigate, value.role])

  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="flex flex-row">
        <BlocklyCanvasPanel day={day} setDay={setDay} isSandbox={isSandbox} />
      </div>
    </div>
  )
}
