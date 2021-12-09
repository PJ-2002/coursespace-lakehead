//@ts-check
import dynamic from "next/dynamic"
import { useState } from "react"
import { Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import Page from "components/Page";
import { getAuth } from "firebase/auth";
import { collection, documentId, getFirestore, query, where } from "firebase/firestore";
import { useCollectionDataOnce, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Person } from "@mui/icons-material";

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

const ClasslistView = ({
  firestore,
  course
}) => {
  const [classEnrolls, classEnrollsLoading] = useCollectionDataOnce(
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
          </ListItem>
        ))
      }
    </List>
  )
}

const StudentClassListPage = () => {
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
          : <ClasslistView
              course={selectedCourse}
              firestore={firestore}
            />
      }
    </Page>
  )
}

export default dynamic(() => Promise.resolve(StudentClassListPage), {
  ssr: false 
})