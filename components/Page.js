// @ts-check

import { getAuth, signOut } from "@firebase/auth"
import { IconButton, AppBar, Box, Toolbar, Typography, Button } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"

/**
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} [props.hasBack]
 * @param {() => void} [props.onBack]
 * @param {*} props.children
 */
export default function Page({
  title,
  hasBack,
  onBack,
  children
}) {
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
          { hasBack &&
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => onBack ? onBack() : undefined}
            >
              <ArrowBack />
            </IconButton>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title} {user ? `- ${user.email}` : ""}
          </Typography>

          { user && <Button color="inherit" onClick={onLogoutClick}>Logout</Button> }

        </Toolbar>
      </AppBar>
      
      <Box>
        { children }
      </Box>
    </Box>
  )
}