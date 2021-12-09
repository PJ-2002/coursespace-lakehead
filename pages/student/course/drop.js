//@ts-check

import dynamic from "next/dynamic"
import { getAuth } from "@firebase/auth"
import { collection, deleteDoc, doc, documentId, FieldPath, getDoc, getDocs, getFirestore, query, where } from "@firebase/firestore"
import { Button, List, ListItem, ListItemText, ListSubheader } from "@mui/material"
import Page from "components/Page"
import moment from "moment"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection, useCollectionData, useCollectionDataOnce, useDocumentDataOnce } from "react-firebase-hooks/firestore"



const CourseList = ({
  firestore,
  term,
  termId,
  termEnrollments,
  onDrop
}) => {
  const courseIds = termEnrollments.map((e) => e.courseId)

  const [courses, coursesLoading] = useCollectionDataOnce(
    query(
      collection(firestore, "courses"),
      // Do not match any fields if there are no courses enrolled to keep list empty
      where(documentId(), "in", courseIds.length > 0 ? courseIds : ["_"])
    ),
    { idField: "id" }
  )

  const [duedates, duedatesLoading] = useDocumentDataOnce(
    doc(firestore, "duedates", termId)
  )

  const onDropClick = (course) => {
    if (moment(Date.now()).isAfter(moment(duedates.drop.toDate()))) {
      alert("The drop deadline for the semester has passed!")
      return
    }

    if (confirm("Are you sure you want to drop this course ?")) {
      onDrop(course)
    }
  }

  return (
    <>
      <ListSubheader>{term} {duedates?.drop ? `(drop deadline on ${moment(duedates.drop.toDate()).format("MM/DD/YYYY")})` : ""}</ListSubheader>
      {
        (coursesLoading || duedatesLoading)
        ? <h4>Loading</h4>
        : courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={`${course.name} (${course.code})`}
                secondary={`${course.dept} - Instructor: ${course.instructorName}`}
              />

              <Button onClick={() => onDropClick(course)}>
                Drop
              </Button>
            </ListItem>
          ))
      }
    </>
  )
}

const DropCoursePage = () => {
  const firestore = getFirestore()
  const auth = getAuth()

  const router = useRouter()
  const [user] = useAuthState(auth)

  const [enrolledCourses, enrolledCoursesLoading] = useCollectionData(
    query(
      collection(firestore, "enrollments"),
      where("studentUid", "==", user.uid)
    )
  )

  const fallEnrolledCourses = enrolledCourses?.filter((c) => c.courseLen === "fall")
  const winterEnrolledCourses = enrolledCourses?.filter((c) => c.courseLen === "winter")
  const springEnrolledCourses = enrolledCourses?.filter((c) => c.courseLen === "spring")
  const summerEnrolledCourses = enrolledCourses?.filter((c) => c.courseLen === "summer")
  const yearLongEnrolledCourses = enrolledCourses?.filter((c) => c.courseLen === "year-long")

  if (enrolledCoursesLoading) {
    return (
      <h2>Loading...</h2>
    )
  }

  const onDrop = async (course) => {
    // If things are right, this should delete only a single element
    const enrollment = await getDocs(
      query(
        collection(firestore, "enrollments"),
        where("courseId", "==", course.id),
        where("studentUid", "==", user.uid),
      )
    )

    enrollment.forEach((doc) => deleteDoc(doc.ref))
  }

  return (
    <Page title="Drop Courses" hasBack onBack={router.back}>
      <h2>Drop Courses</h2>
      {
        enrolledCoursesLoading
          ? <h2>Loading...</h2>
          : <List>
              <CourseList
                firestore={firestore}
                onDrop={onDrop}
                term={"Fall"}
                termId={"fall"}
                termEnrollments={fallEnrolledCourses}
              />

              <CourseList
                firestore={firestore}
                onDrop={onDrop}
                term={"Winter"}
                termId={"winter"}
                termEnrollments={winterEnrolledCourses}
              />

              <CourseList
                firestore={firestore}
                onDrop={onDrop}
                term={"Spring"}
                termId={"spring"}
                termEnrollments={springEnrolledCourses}
              />

              <CourseList
                firestore={firestore}
                onDrop={onDrop}
                term={"Summer"}
                termId={"summer"}
                termEnrollments={summerEnrolledCourses}
              />

              <CourseList
                firestore={firestore}
                onDrop={onDrop}
                term={"Year-long"}
                termId={"year-long"}
                termEnrollments={yearLongEnrolledCourses}
              />
            </List>
      }
    </Page>
  )
}

export default dynamic(() => Promise.resolve(DropCoursePage), { ssr: false })