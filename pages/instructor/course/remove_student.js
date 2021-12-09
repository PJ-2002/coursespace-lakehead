// @ts-check

import dynamic from "next/dynamic"

import { getAuth } from "@firebase/auth";
import { collection, deleteDoc, doc, getFirestore, query, where } from "@firebase/firestore";
import { Person } from "@mui/icons-material";
import { Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import Page from "components/Page";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";

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
  onDrop
}) => {
  const [classEnrolls, classEnrollsLoading] = useCollectionData(
    query(
      collection(firestore, "enrollments"),
      where("courseId", "==", course.id)
    ),
    { idField: "id" }
  )

  const onDropClick = (enroll) => {
    if (confirm("Are you sure you want to remove this student ?")) {
      onDrop(enroll)
    }
  }

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
            <Button onClick={() => onDropClick(enroll)}>
              Remove
            </Button>
          </ListItem>
        ))
      }
    </List>
  )
}

const RemoveStudentPage = () => {
  const firestore = getFirestore()
  const auth = getAuth()

  const router = useRouter()
  const [user] = useAuthState(auth)

  const [selectedCourse, setSelectedCourse] = useState(null)

  const goBack = () => {
    // If selected course is present, unselect and go back to select screen, else go back
    if (selectedCourse) {
      setSelectedCourse(null)
    } else {
      router.back()
    }
  }

  const onCourseSelect = (course) => {
    setSelectedCourse(course)
  }

  const onEnrollDrop = async (enroll) => {
    await deleteDoc(doc(firestore, "enrollments", enroll.id))

    alert("Student removed!")
  }

  return (
    <Page title="Remove Student" hasBack onBack={goBack}>
      {
        !selectedCourse
          ? <MyCourseList
              firestore={firestore}
              onCourseSelect={onCourseSelect}
              user={user}
            />
          : <ClasslistView 
              firestore={firestore}
              course={selectedCourse}
              onDrop={onEnrollDrop}
            />
      }
    </Page>
  )
}

export default dynamic(() => Promise.resolve(RemoveStudentPage), { ssr: false })