// @ts-check
import { getAuth } from "@firebase/auth";
import { addDoc, collection, doc, getFirestore, query, where } from "@firebase/firestore";
import { Box, Button, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Page from "components/Page";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";

const MAX_ENROLLED_COUNT = 5

const useCourseList = (
  /** @type {import("@firebase/firestore").Firestore} */
  firestore,
  /** @type {"fall" | "winter" | "spring" | "summer" | "year-long"} */ 
  length
) => useCollectionDataOnce(
  query(
    collection(firestore, "courses"),
    where("length", "==", length)
  ), {
    idField: "id"
  }
)

const CourseList = ({
  courses,
  /** @type {number} */ enrolledCount,
  /** @type {string} **/ title,
  /** @type {boolean} **/ loading,
  /** @type {any[]} **/ enrollments,
  onEnroll
}) => {
  const onEnrollClick = (course) => {
    if (enrolledCount == MAX_ENROLLED_COUNT) {
      alert("You have enrolled for maximum number of classes this semester");
    } else {
      onEnroll(course)
    } 
  }

  return loading
    ? <h1>Loading...</h1>
    : (
      <Box>
        <h1>{title}</h1>
        <h4>Enrolled in {enrolledCount} / {MAX_ENROLLED_COUNT} courses</h4>
        <List>
          {courses.map((
            /** @type {{ id: string, name: string, dept: string, instructorName: string }} */
            course
          ) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={course.name}
                secondary={`${course.dept} - Instructor: ${course.instructorName}`} />

              <Button
                disabled={enrollments.find((/** @type {{ courseId: string; }} */ enrollment) => enrollment.courseId === course.id)}
                onClick={() => onEnrollClick(course)}>Enroll</Button>
            </ListItem>
          ))}
        </List>
      </Box>
    );
}

export default function CourseEnrollPage() {
  const firestore = getFirestore()
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  const onEnrollClick = async (/** @type {{ id: string; name: String; length: string; }} */ course) => {
    await addDoc(
      collection(firestore, "enrollments"), 
      {
        studentUid: user.uid,
        courseId: course.id,
        courseLen: course.length,
        status: "waitlist"
      }
    )

    alert(`Enrolled to ${course.name}!!`)
  }

  const [fallCourse, fallLoading] = useCourseList(firestore, "fall")
  const [winterCourse, winterLoading] = useCourseList(firestore, "winter")
  const [springCourse, springLoading] = useCourseList(firestore, "spring")
  const [summerCourse, summerLoading] = useCourseList(firestore, "summer")
  const [yearCourse, yearLoading] = useCourseList(firestore, "year-long")

  const [enrolled, enrolledLoading] = useCollectionData(
    query(
      collection(firestore, "enrollments"),
      where("studentUid", "==", user.uid)
    ), {
      idField: "id"
    }
  )

  const fallEnrolledCount = enrolled?.filter((enrollment) => enrollment.courseLen === "fall").length ?? 0
  const winterEnrolledCount = enrolled?.filter((enrollment) => enrollment.courseLen === "winter").length ?? 0
  const springEnrolledCount = enrolled?.filter((enrollment) => enrollment.courseLen === "spring").length ?? 0
  const summerEnrolledCount = enrolled?.filter((enrollment) => enrollment.courseLen === "summer").length ?? 0
  const yearEnrolledCount = enrolled?.filter((enrollment) => enrollment.courseLen === "year-long").length ?? 0

  return (
    <Page title="Enroll courses" hasBack onBack={router.back}>
      <CourseList 
        title="Fall" 
        enrolledCount={fallEnrolledCount}
        courses={fallCourse} 
        loading={enrolledLoading || fallLoading} 
        enrollments={enrolled}
        onEnroll={onEnrollClick}
      />
      <CourseList 
        title="Winter" 
        enrolledCount={winterEnrolledCount}
        courses={winterCourse} 
        loading={enrolledLoading || winterLoading} 
        enrollments={enrolled}
        onEnroll={onEnrollClick}
      />
      <CourseList 
        title="Spring" 
        enrolledCount={springEnrolledCount}
        courses={springCourse} 
        loading={enrolledLoading || springLoading} 
        enrollments={enrolled}
        onEnroll={onEnrollClick}
      />
      <CourseList 
        title="Summer" 
        enrolledCount={summerEnrolledCount}
        courses={summerCourse} 
        loading={enrolledLoading || summerLoading} 
        enrollments={enrolled}
        onEnroll={onEnrollClick}
      />
      <CourseList 
        title="Year-long" 
        enrolledCount={yearEnrolledCount}
        courses={yearCourse} 
        loading={enrolledLoading || yearLoading} 
        enrollments={enrolled}
        onEnroll={onEnrollClick}
      />
    </Page>
  )
}