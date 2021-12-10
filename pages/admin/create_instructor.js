// @ts-check
import { getAuth, signOut } from "@firebase/auth"
import { Box, AppBar, Toolbar, Typography, Button, TextField, IconButton} from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

import axios from "axios"
import { ArrowBack, RouteRounded } from "@mui/icons-material"
import Page from "components/Page"

// function to create instructor account
// from admin page
export default function CreateInstructor() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  //set name, email, password
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

  // click logout to sign out from the page
  const onLogoutClick = () => {
    signOut(auth)
    router.replace("/")
  }

  // function to create users
  const createUser = () => {
    axios.post("https://us-central1-coursespace-lakehead.cloudfunctions.net/createInstructor", {
      name,
      email,
      password
    }).then(() => {
      alert("User Created!")
      router.push("/instructor")
    })
    .catch((err) => alert(`Error occured: ${err}`))
  }

  return (
    <Page title="Create Instructor" hasBack onBack={router.back}>
      <TextField 
        label={"Instructor Name"} 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <TextField 
        label={"Instructor Email"} 
        type={"email"} 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <TextField 
        label={"Instructor Initial Password"} 
        type={"password"} 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Button variant={"contained"} onClick={() => createUser()}>Create Instructor User</Button>
    </Page>
  )
}