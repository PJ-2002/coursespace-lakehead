// @ts-check
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import Page from "components/Page"
import { useRouter } from "next/router"
import { useState } from "react"
import { addDoc, collection, getFirestore } from "@firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { getAuth } from "@firebase/auth"

export default function CreateCourse() {
  const firestore = getFirestore()
  const auth = getAuth() 

  const router = useRouter()
  const [user] = useAuthState(auth)
  
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [courseCapacity, setCourseCapacity] = useState(0)
  const [dept, setDept] = useState("")
  const [courseLen, setCourseLen] = useState("fall")

  const onCreateCourse = async () => {
    const course = {
      name: courseName,
      code: courseCode,
      capacity: courseCapacity,
      dept: dept,
      length: courseLen,
      instructorUid: user.uid,
      instructorName: user.displayName ?? user.email
    }

    await addDoc(
      collection(firestore, "courses"),
      course
    )

    alert("Course Created!")
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

        <Button onClick={onCreateCourse}>Create Course</Button>
      </Box>
    </Page>
  )
}