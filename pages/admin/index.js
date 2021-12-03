// @ts-check
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { AppBar, Box, Button, Toolbar, Typography, List, ListSubheader, ListItemText, ListItemButton, ListItemIcon } from "@mui/material"
import { CalendarToday, PersonAdd } from "@mui/icons-material"
import ActionListEntry from "components/ActionListEntry"

export default function Admin() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()
  
  const onLogoutClick = () => {
    signOut(auth)
    router.replace("/")
  }

  const goTo = (path) => {
    router.push(path)
  }

  return (
    <Box>
      <AppBar position={"sticky"}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - {user?.email}
          </Typography>
          <Button color="inherit" onClick={onLogoutClick}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box>
        <List
          subheader={
            <ListSubheader style={{fontSize: 20 }}>
              Actions
            </ListSubheader>
          }
        >
          <ListSubheader>
            Accounts
          </ListSubheader>

          <ActionListEntry
            icon={<PersonAdd />}
            to={"/admin/create_student"}
            text={"Add Student"}
          />

          <ActionListEntry
            icon={<PersonAdd />}
            to={"/admin/create_instructor"}
            text={"Add Instructor"}
          />

          <ListSubheader>
            Terms &amp; Courses
          </ListSubheader>

          <ActionListEntry
            icon={<CalendarToday />}
            to={"/admin/update_termdates"}
            text={"Update Term Due Dates"}
          />
        </List>
      </Box>
    </Box>
  )
}