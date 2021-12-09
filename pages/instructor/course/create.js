// @ts-check
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import Page from "components/Page"
import { useRouter } from "next/router"
import { useState } from "react"
import { addDoc, collection, getFirestore } from "@firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { getAuth } from "@firebase/auth"
import { Add, Delete, Schema } from "@mui/icons-material"
import dynamic from "next/dynamic"

const MarkingSchemeList = ({
  markingScheme,
  onSchemeUpdate,
  onDeleteCriterion
}) => (
  markingScheme.map((scheme, index) => 
    <Box key={index}>
      <TextField
        label={"Criterion Name"}
        value={scheme.name}
        onChange={(e) => onSchemeUpdate(index, { ...scheme, name: e.target.value })} />
      <TextField
        label={"Maximum Marks"}
        type={"number"}
        value={scheme.maxMark}
        onChange={(e) => onSchemeUpdate(index, { ...scheme, maxMark: parseInt(e.target.value) })} />
      <TextField
        label={"Weightage (%)"}
        sx={{ width: 100 }}
        value={scheme.weightage}
        type={"number"}
        InputProps={{ inputProps: { max: 100, min: 0 } }}
        onChange={(e) => onSchemeUpdate(index, { ...scheme, weightage: parseInt(e.target.value) })} />
      <IconButton onClick={() => onDeleteCriterion(index)}>
        <Delete />
      </IconButton>
    </Box>
  )
)

const CreateCourse = () => {
  const firestore = getFirestore()
  const auth = getAuth() 

  const router = useRouter()
  const [user] = useAuthState(auth)
  
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [courseCapacity, setCourseCapacity] = useState(0)
  const [dept, setDept] = useState("")
  const [courseLen, setCourseLen] = useState("fall")
  const [markingScheme, setMarkingScheme] = useState([])

  const onCreateCourse = async () => {
    const course = {
      name: courseName,
      code: courseCode,
      capacity: courseCapacity,
      dept: dept,
      length: courseLen,
      instructorUid: user.uid,
      instructorName: user.displayName ?? user.email,
      markingScheme: markingScheme
    }

    await addDoc(
      collection(firestore, "courses"),
      course
    )

    alert("Course Created!")
  }

  const addMarkingScheme = () => {
    setMarkingScheme([...markingScheme, {
      name: "",
      maxMark: 0,
      weightage: 0,
    }])
  }

  const onMarkingSchemeUpdate = (index, newScheme) => {
    setMarkingScheme(
      markingScheme.map((el, i) => index === i ? newScheme : el)
    )
  }

  const onDeleteCriterion = (index) => {
    setMarkingScheme(
      markingScheme.filter((_, i) => index !== i)
    )
  }

  return (
    <Page
      title="Create Course"
      hasBack
      onBack={router.back}
    >
      <Typography variant="h4">Create Course</Typography>
      <Box>
        <TextField label="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
        <TextField label="Course Code" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
        <TextField label="Department" value={dept} onChange={(e) => setDept(e.target.value) } />
        <TextField type={"number"} label="Course Capacity" value={courseCapacity} onChange={(e) => setCourseCapacity(parseInt(e.target.value))} />

        <br />
        <br />

        <FormControl fullWidth>
          <InputLabel id="course_len_label">Course Time/Length</InputLabel>
          <Select labelId="course_len_label" label="Course Time/Length" value={courseLen} onChange={(e) => setCourseLen(e.target.value)}>
            <MenuItem value="fall">Fall</MenuItem>
            <MenuItem value="winter">Winter</MenuItem>
            <MenuItem value="spring">Spring</MenuItem>
            <MenuItem value="summer">Summer</MenuItem>
            <MenuItem value="year-long">Year long</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <h3>Marking Scheme</h3>

          <MarkingSchemeList
            markingScheme={markingScheme}
            onSchemeUpdate={onMarkingSchemeUpdate}
            onDeleteCriterion={onDeleteCriterion}
          />

          <Button onClick={() => addMarkingScheme()} variant="contained" startIcon={<Add />}>
            Add Marking Field
          </Button>
        </Box>

        <Button onClick={onCreateCourse}>Create Course</Button>
      </Box>
    </Page>
  )
}

export default dynamic(() => Promise.resolve(CreateCourse), {
  ssr: false
})