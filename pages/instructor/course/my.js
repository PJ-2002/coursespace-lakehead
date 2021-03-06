// @ts-check
import Page from "components/Page";
import { useRouter } from "next/router";
import { collection, getFirestore, query, where } from "@firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { List, ListItem, ListItemText } from "@mui/material";

export default function MyCourses() {
  const firestore = getFirestore()
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  // Sql query to search for a course
  const [myCourses, loading] = useCollectionDataOnce(
    query(
      collection(firestore, "courses"),
      where("instructorUid", "==", user?.uid ?? "")
    ),
    { idField: "id"}
  )

  return (
    <Page title="My Courses" hasBack onBack={router.back}>
      { loading
        ? <p>Loading...</p>
        : <>
            <List subheader={<h4>Your Courses</h4>}>
              {
                myCourses.map((course) => 
                    <ListItem key={course.id}>
                      <ListItemText 
                        primary={`[${course.code}] ${course.name}`}
                        secondary={course.dept}
                      />
                    </ListItem>
                  )
              }
            </List>
          </>
      }
    </Page>
  )
}