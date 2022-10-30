import { Divider, message, Table } from "antd"
import Picker from "emoji-picker-react"
import { parseFullName } from "parse-full-name"
import React, { useState } from "react"
import { CSVReader } from "react-papaparse"
import { addStudent, addStudents } from "../../../../../Utils/requests"
import "./AddStudents.less"

export default function AddStudents({ classroomId, addStudentsToTable }) {
  const [name, setName] = useState("")
  const [uploadedRoster, setUploadedRoster] = useState([])
  const [tableData, setTableData] = useState([])
  const [chosenCharacter, setChosenCharacter] = useState(null)

  const buttonRef = React.createRef()

  const nameIsFormatted = n => {
    let name = parseFullName(n)
    return Boolean(name.first && name.last)
  }

  const reformatName = n => {
    // check "Last, First" / "Last, First Middle"
    let name = parseFullName(n)
    if (name.first && name.last) {
      return `${name.first} ${name.last[0]}.`
    }
    // if (n.search('^([A-Za-z]+),\\s*([A-Za-z]+)\\s*([A-Za-z]+)') !== -1) {
    //   let names = n.split(' ');
    //   if (names.length === 3)
    //     return `${names[1]} ${names[2]} ${names[0].substring(0, 1)}.`;
    //   return `${names[1]} ${names[0].substring(0, 1)}.`;
    // }
    // // check "First L." and "First Middle L."
    // else if (n.search('^([A-Za-z]+)\\s*([A-Za-z]*)\\s+([A-Za-z])\\.$') !== -1) {
    //   return n;
    // }
    // return null. not properly formatted
    else return null
  }

  const handleManualAdd = async () => {
    const formattedName = reformatName(name)
    if (!formattedName) {
      message.warning(
        "Please verify that the name you entered is in the specified format.",
        6
      )
      return
    }
    const res = await addStudent(
      formattedName,
      chosenCharacter ? chosenCharacter.emoji : null,
      classroomId
    )
    if (res.data) {
      addStudentsToTable([res.data])
      message.success(
        `${formattedName} has been added to the roster successfully.`
      )
      setChosenCharacter(null)
      setName("")
    } else {
      message.error(res.err)
    }
  }

  const handleCsvAdd = async () => {
    const students = await uploadedRoster.map(student => {
      return {
        name: student.name.trim(),
        character: student.animal.trim(),
      }
    })
    const res = await addStudents(students, classroomId)
    if (res.data) {
      addStudentsToTable(res.data)
      message.success("Uploaded roster added to classroom successfully.")
    } else {
      message.error(res.err)
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Animal",
      dataIndex: "animal",
      key: "animal",
    },
  ]

  const getTableData = async students => {
    const tableData = await students.map((student, index) => {
      return {
        key: index,
        name: student.name,
        animal: student.animal,
      }
    })
    return tableData
  }

  const handleOnDrop = async roster => {
    // on file select, filter out bad data and set uploadedRoster and tableData
    let badInput = false
    let students = roster.filter(student => {
      if (student.data.name) {
        if (nameIsFormatted(student.data.name.trim())) return true
        badInput = true
      }
      return false
    })
    students = await students.map(student => {
      return {
        name: reformatName(student.data.name.trim()),
        animal: student.data.animal.trim(),
      }
    })

    setUploadedRoster(students)
    const data = await getTableData(students)
    setTableData(data)
    if (badInput || students.length === 0)
      message.warning(
        "There may have been an issue parsing one or more data entries in the uploaded CSV. " +
          " Please verify that your data is in the specified format.",
        8
      )
  }

  const handleOnRemoveFile = () => {
    // clear uploadedRoster and tableData when file is unselected
    setUploadedRoster([])
    setTableData([])
  }

  const handleRemoveFile = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.error(err)
    message.error("Failed to parse the uploaded file.")
  }

  const onEmojiClick = (event, emojiObject) => {
    setChosenCharacter(emojiObject)
  }

  return (
    <div id="add-students">
      <div id="manual-input">
        <h3>Manual Input:</h3>
        <p>
          Name should be in the format: "Last, First", "Last, First Middle",
          "First L." or "First Middle L."
        </p>
        <form>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value)
            }}
            id="name"
            name="name"
            placeholder="Student Name"
          />
          <div id="emoji-picker">
            {chosenCharacter ? (
              <span>Student Character: {chosenCharacter.emoji}</span>
            ) : (
              <span>Optional: Student Character</span>
            )}
            <Picker
              onEmojiClick={onEmojiClick}
              groupVisibility={{
                flags: false,
                smileys_people: false,
                travel_places: false,
                objects: false,
                symbols: false,
              }}
              preload
              native
            />
          </div>
          <br />
          <input type="button" value="Add Student" onClick={handleManualAdd} />
        </form>
      </div>
      <Divider />
      <div>
        <h3>Upload Roster CSV:</h3>
        <p>
          CSV should have the following columns: "Name" or "Student", (optional)
          "Animal"
        </p>
        <p>
          Name/Student column should be in the format: "Last, First", "Last,
          First Middle", "First L." or "First Middle L."
        </p>
        <p>
          Sample Student Name CSV File:{" "}
          <a
            href="https://drive.google.com/file/d/1MeGaw3oMP_uEEvaIqp_Sa6zDN3dfy2lS/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            https://drive.google.com/file/d/1MeGaw3oMP_uEEvaIqp_Sa6zDN3dfy2lS/view?usp=sharing
          </a>
        </p>
        <CSVReader
          ref={buttonRef}
          onDrop={handleOnDrop}
          onError={handleOnError}
          onRemoveFile={handleOnRemoveFile}
          progressBarColor={"#5BABDE"}
          config={{
            header: true,
            transformHeader: h => {
              let header = h.toLowerCase().trim()
              if (header === "student" || header === ["student name"])
                header = "name"
              return header
            },
          }}
          addRemoveButton
        >
          <span>Click to upload your roster.</span>
        </CSVReader>
        <br />
        {uploadedRoster.length > 0 ? (
          <div>
            <Table
              dataSource={tableData}
              columns={columns}
              size="small"
              title={() => "Review your uploaded roster:"}
            />
            <input
              type="button"
              value="Add Students"
              onClick={e => {
                handleRemoveFile(e)
                handleCsvAdd(e)
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
