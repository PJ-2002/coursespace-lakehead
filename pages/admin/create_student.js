// @ts-check
import { getAuth, signOut } from "@firebase/auth"
import { IconButton, Box, AppBar, Toolbar, Typography, Button, TextField} from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

import axios from "axios"
import Page from "components/Page"

// function to create student account
// from admin page
export default function CreateStudent() {
  const auth = getAuth()

  const [user] = useAuthState(auth)
  const router = useRouter()

  // seting name, email, and password
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
    axios.post("https://us-central1-coursespace-lakehead.cloudfunctions.net/createStudent", {
      name,
      email,
      password
    }).then(() => {
      alert("User Created!")
      router.push("/admin")
    })
    .catch((err) => alert(`Error occured: ${err}`))
  }

  return (
    <Page title="Create Student" hasBack onBack={router.back}>
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
      <Button variant={"contained"} onClick={() => createUser()}>Create Student User</Button>
    </Page>
  )
}