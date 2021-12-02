//@ts-check
import { getAuth } from "@firebase/auth"
import { List, ListSubheader, ListItemIcon, ListItemButton, ListItemText } from "@mui/material"
import Page from "components/Page"
import { Bookmark, BookmarkAdd } from "@mui/icons-material"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"

const ListEntry = ({ icon, to, text }) => {
  const router = useRouter()

  return (
    <ListItemButton>
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText onClick={() => router.push(to)}>
        { text }
      </ListItemText>
    </ListItemButton>
  )
}

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

        <ListItemButton>
          <ListItemIcon>
            <BookmarkAdd />
          </ListItemIcon>
          <ListItemText onClick={() => goTo("/instructor/course/create")}>
            Create Course
          </ListItemText>
        </ListItemButton>

      </List>
    </Page>
  )
}