//@ts-check
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { Button, Box, AppBar, Toolbar, Typography, List, ListSubheader, ListItem} from "@mui/material"

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
    <Box>
      <AppBar position={"sticky"}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student - {user?.displayName ?? user?.email}
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
        </List>
      </Box>
    </Box>
  )
}