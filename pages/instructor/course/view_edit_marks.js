//@ts-check

import { Person } from "@mui/icons-material"
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader, TextField } from "@mui/material"
import Page from "components/Page"
import { getAuth } from "firebase/auth"
import { collection, deleteDoc, doc, getFirestore, query, updateDoc, where } from "firebase/firestore"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore"

const CourseListTermList = ({
  term,
  courses,
  onSelect
}) => {
  return (
    <>
      <ListSubheader>
        {term}
      </ListSubheader>

      {
        courses.map((course) =>
          <ListItem key={course.id}>
            <ListItemText 
              primary={`${course.name} (${course.code})`}
            />
            <Button onClick={() => onSelect(course)}>
              Select
            </Button>
          </ListItem>
        )
      }
    </>
  )
}

// Sql query to get couse list 
const MyCourseList = ({
  firestore,
  user,
  onCourseSelect
}) => {
  const [myCourses, myCoursesLoading] = useCollectionDataOnce(
    query(
      collection(firestore, "courses"),
      where("instructorUid", "==", user.uid)
    ),
    { idField: "id" }
  )

  const fallCourses = myCourses?.filter((c) => c.length === "fall")
  const winterCourses = myCourses?.filter((c) => c.length === "winter")
  const springCourses = myCourses?.filter((c) => c.length === "spring")
  const summerCourses = myCourses?.filter((c) => c.length === "summer")
  const yearLongCourses = myCourses?.filter((c) => c.length === "year-long")

  if (myCoursesLoading) {
    return (
      <List subheader={<h4>Loading...</h4>}>
      </List>
    )
  }

  return (
    <List subheader={<h4>Select course </h4>}>
      <CourseListTermList
        term="Fall"
        courses={fallCourses}
        onSelect={onCourseSelect}
      />
      <CourseListTermList
        term="Winter"
        courses={winterCourses}
        onSelect={onCourseSelect}
      />
      <CourseListTermList
        term="Spring"
        courses={springCourses}
        onSelect={onCourseSelect}
      />
      <CourseListTermList
        term="Summer"
        courses={summerCourses}
        onSelect={onCourseSelect}
      />
      <CourseListTermList
        term="Year-long"
        courses={yearLongCourses}
        onSelect={onCourseSelect}
      />
    </List>
  )
}

const ClasslistView = ({
  firestore,
  course,
  onSelect
}) => {
  const [classEnrolls, classEnrollsLoading] = useCollectionData(
    query(
      collection(firestore, "enrollments"),
      where("courseId", "==", course.id)
    ),
    { idField: "id" }
  )

  if (classEnrollsLoading) {
    return <h4>Loading...</h4>
  }

  return (
    <List
      subheader={<h4>Classlist</h4>}
    >
      {
        classEnrolls.map((enroll) => (
          <ListItem key={enroll.id}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText 
              primary={enroll.studentName}
              secondary={enroll.studentEmail}
            />
            <Button onClick={() => onSelect(enroll)}>
              VIEW/EDIT 
            </Button>
          </ListItem>
        ))
      }
    </List>
  )
}

const ViewEditMarkView = ({
  course,
  enroll,
  onMarkUpdate
}) => {
  const [marks, setMarks] = useState(enroll?.marking ?? course.markingScheme.map(() => null))

  return (
    <>
      <h3>Marking</h3>
      {
        course.markingScheme.map((criterion, index) => 
          <Box key={index}>
            <h4>{criterion.name}</h4>
            <h5>Max Marks: {criterion.maxMark} - Weightage: {criterion.weightage}%</h5>

            <TextField 
              type={"number"} 
              label={"Mark"} 
              value={marks[index] ?? ""} 
              InputProps={{ inputProps: { min: 0, max: criterion.maxMark }}}
              onChange={(e) => setMarks(marks.map((m, i) => i === index ? parseInt(e.target.value) : m))}
            />
          </Box>
        )
      }
      <Button variant={"contained"} onClick={() => onMarkUpdate(enroll, marks)}>
        Update Marks
      </Button>
    </>
  )
}

const ViewEditMarksPage = () => {
  const firestore = getFirestore()
  const auth = getAuth()

  const router = useRouter()
  const [user] = useAuthState(auth)

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedEnroll, setSelectedEnroll] = useState(null)

  const goBack = () => {
    // If selected course/student is present, unselect and go back to select screen, else go back
    if (selectedEnroll) {
      setSelectedEnroll(null)
    } else if (selectedCourse) {
      setSelectedCourse(null)
    } else {
      router.back()
    }
  }

  const onCourseSelect = (course) => {
    setSelectedCourse(course)
  }

  const onEnrollSelect = (enroll) => {
    setSelectedEnroll(enroll)
  }

  const onMarkUpdate = async (enroll, updatedMarking) => {
    await updateDoc(
      doc(firestore, "enrollments", enroll.id), { marking: updatedMarking }
    )

    alert("Marking updated!")
    setSelectedEnroll(null)
  }

  return (
    <Page title="Remove Student" hasBack onBack={goBack}>
      {
        selectedEnroll
        ? <ViewEditMarkView 
            course={selectedCourse}
            enroll={selectedEnroll}
            onMarkUpdate={onMarkUpdate}
          />
        : !selectedCourse
            ? <MyCourseList
                firestore={firestore}
                onCourseSelect={onCourseSelect}
                user={user}
              />
            : <ClasslistView 
                firestore={firestore}
                course={selectedCourse}
                onSelect={onEnrollSelect}
              />
      }
    </Page>
  )
}

export default dynamic(() => Promise.resolve(ViewEditMarksPage), {
  ssr: false
})