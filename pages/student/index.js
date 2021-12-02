//@ts-check
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { Button, Box, AppBar, Toolbar, Typography, List, ListSubheader, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import Page from "components/Page"
import { BookmarkAdd } from "@mui/icons-material"

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

export default function StudentPage() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()
  
  const onLogoutClick = () => {
    signOut(auth)
    router.replace("/")
  }

  const goTo = (/** @type {string} */ path) => {
    router.push(path)
  }

  console.log(user)

  return (
    <Page title="Student">
      <List
        subheader={
          <ListSubheader style={{fontSize: 20 }}>
            Actions
          </ListSubheader>
        }
      >
        <ListSubheader>
          Courses 
        </ListSubheader>
        
        <ListEntry icon={<BookmarkAdd />} to="/student/course/enroll" text="Enroll on courses" />
      </List>
    </Page>
  )
}