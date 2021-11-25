//@ts-check
import { getAuth, signOut } from "@firebase/auth"
import { Button, Box, AppBar, Toolbar, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"

export default function InstructorPage() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  const onLogoutClick = () => {
    signOut(auth)
    router.push("/")
  }

  return (
    <Box>
      <AppBar position={"sticky"}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Instructor - {user?.displayName ?? user?.email}
          </Typography>
          <Button color="inherit" onClick={onLogoutClick}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}