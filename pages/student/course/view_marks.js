// @ts-check

import { getAuth } from "@firebase/auth"
import { collection, documentId, getFirestore, query, where } from "@firebase/firestore"
import { Person } from "@mui/icons-material"
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import Page from "components/Page"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionDataOnce } from "react-firebase-hooks/firestore"

// iterate through the course list to find the searching course
const CourseSelectTermList = ({
  firestore,
  term,
  termEnrollments,
  onSelect
}) => {
  const courseIds = termEnrollments.map((e) => e.courseId)

  const [courses, coursesLoading] = useCollectionDataOnce(
    query(
      collection(firestore, "courses"),
      where(documentId(), "in", courseIds.length > 0 ? courseIds : ["_"])
    ),
    { idField: "id" }
  )

  return (
    <>
      <ListSubheader>{term}</ListSubheader>
      {
        coursesLoading
        ? <h4>Loading...</h4>
        : courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={`${course.name} (${course.code})`}
                secondary={`${course.dept} - Instructor: ${course.instructorName}`}
              />

              <Button onClick={() => onSelect(course)}>
                View
              </Button>
            </ListItem>
          ))
      }
    </>
  )
}

const CourseSelect = ({
  firestore,
  user,
  onCourseSelect
}) => {
  const [myEnrolls, myEnrollsLoading] = useCollectionDataOnce(
    query(
      collection(firestore, "enrollments"),
      where("studentUid", "==", user.uid)
    )
  )

  const fallCourses = myEnrolls?.filter((c) => c.courseLen === "fall")
  const winterCourses = myEnrolls?.filter((c) => c.courseLen === "winter")
  const springCourses = myEnrolls?.filter((c) => c.courseLen === "spring")
  const summerCourses = myEnrolls?.filter((c) => c.courseLen === "summer")
  const yearLongCourses = myEnrolls?.filter((c) => c.courseLen === "year-long")

  if (myEnrollsLoading) {
    return (
      <List subheader={<h4>Loading...</h4>}>
      </List>
    )
  }

  return (
    <List
      subheader={<h3>Select course</h3>}
    >
      <CourseSelectTermList
        firestore={firestore}
        term={"Fall"}
        termEnrollments={fallCourses}
        onSelect={onCourseSelect}
      />
      <CourseSelectTermList
        firestore={firestore}
        term={"Winter"}
        termEnrollments={winterCourses}
        onSelect={onCourseSelect}
      />
      <CourseSelectTermList
        firestore={firestore}
        term={"Spring"}
        termEnrollments={springCourses}
        onSelect={onCourseSelect}
      />
      <CourseSelectTermList
        firestore={firestore}
        term={"Summer"}
        termEnrollments={summerCourses}
        onSelect={onCourseSelect}
      />
      <CourseSelectTermList
        firestore={firestore}
        term={"Year-long"}
        termEnrollments={yearLongCourses}
        onSelect={onCourseSelect}
      />
    </List>
  )
}

const MarksView = ({
  firestore,
  user,
  course
}) => {
  const [enrolls, enrollsLoading] = useCollectionDataOnce(
    query(
      collection(firestore, "enrollments"),
      where("courseId", "==", course.id),
      where("studentUid", "==", user.uid)
    ),
    { idField: "id" }
  )

  if (enrollsLoading) {
    return <h4>Loading...</h4>
  }

  return (
    <Box>
      <h4>Marklist</h4>
      {
        course.markingScheme.map((criterion, index) => 
          (
            <Box key={index}>
              <h4>{criterion.name}</h4>
              <h5>
                Marks: { enrolls[0].marking?.[index] ?? "Not Assigned" } 
                / {criterion.maxMark} (Weightage: {criterion.weightage}%) 
              </h5>
              <br />
              <br />
            </Box>
          )
        )
      }
    </Box>
  )
}

const StudentViewMarksPage = () => {
  const firestore = getFirestore()
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const router = useRouter()

  const backClick = () => {
    // If a course is selected, clear that, else go back a page
    if (selectedCourse) {
      setSelectedCourse(null)
    } else {
      router.back()
    }
  }

  const onCourseSelect = (course) => {
    setSelectedCourse(course)
  }

  return (
    <Page title={"View Classlist"} hasBack onBack={backClick}>
      {
        !selectedCourse
          ? <CourseSelect
              firestore={firestore}
              user={user}
              onCourseSelect={onCourseSelect}
            />
          : <MarksView
              user={user}
              course={selectedCourse}
              firestore={firestore}
            />
      }
    </Page>
  )
}

export default dynamic(() => Promise.resolve(StudentViewMarksPage), {
  ssr: false 
})