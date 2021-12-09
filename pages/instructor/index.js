//@ts-check
import { getAuth } from "@firebase/auth"
import { List, ListSubheader, ListItemIcon, ListItemButton, ListItemText } from "@mui/material"
import Page from "components/Page"
import { Bookmark, BookmarkAdd, PersonRemove, Score } from "@mui/icons-material"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import ActionListEntry from "components/ActionListEntry"

export default function InstructorPage() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  const goTo = (/** @type {string} */ path) => {
    router.push(path)
  }

  return (
    <Page title="Instructor">
      <List
        subheader={
          <ListSubheader style={{ fontSize: 20 }}>
            Actions
          </ListSubheader>
        }
      >
        <ListSubheader>
          Courses
        </ListSubheader>

        <ActionListEntry
          icon={<BookmarkAdd />}
          to={"/instructor/course/create"}
          text={"Create Course"}
        />

        <ActionListEntry
          icon={<Bookmark />}
          to={"/instructor/course/my"}
          text={"View My Courses"}
        />

        <ActionListEntry
          icon={<PersonRemove />}
          to={"/instructor/course/remove_student"}
          text={"Remove Student from a Course"}
        />

        <ActionListEntry
          icon={<Score />}
          to={"/instructor/course/view_edit_marks"}
          text={"Add Marks for a Student"}
        />
      </List>
    </Page>
  )
}