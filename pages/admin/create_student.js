// @ts-check
import { getAuth, signOut } from "@firebase/auth"
import { IconButton, Box, AppBar, Toolbar, Typography, Button, TextField} from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

import axios from "axios"

export default function CreateStudent() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!user) {
    return (
      <div>
        No user
      </div>
    )
  }

  const onLogoutClick = () => {
    signOut(auth)
    router.replace("/")
  }

  const createUser = () => {
    console.log(email)
    console.log(password)
    axios.post("https://us-central1-coursespace-lakehead.cloudfunctions.net/createStudent", {
      name,
      email,
      password
    }).then(() => alert("User Created!"))
    .catch((err) => alert(`Error occured: ${err}`))
  }

  return (
    <Box>
      <AppBar position={"sticky"}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => router.back()}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - {user?.email}
          </Typography>
          <Button color="inherit" onClick={onLogoutClick}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box>
        <TextField 
          label={"Student Name"} 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <TextField 
          label={"Student Email"} 
          type={"email"} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <TextField 
          label={"Student Initial Password"} 
          type={"password"} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <Button onClick={() => createUser()}>Create Student User</Button>
      </Box>
    </Box>
  )
}