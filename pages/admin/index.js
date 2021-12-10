// @ts-check
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { AppBar, Box, Button, Toolbar, Typography, List, ListSubheader, ListItemText, ListItemButton, ListItemIcon } from "@mui/material"
import { CalendarToday, PersonAdd } from "@mui/icons-material"
import ActionListEntry from "components/ActionListEntry"
import Page from "components/Page"

// admin index page
export default function Admin() {
  const router = useRouter()

  return (
    <Page title={"Admin"} hasBack onBack={router.back}>
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
    </Page>
  )
}