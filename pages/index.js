// @ts-check
import { AppBar, Toolbar, Typography, Box, Button, Paper, TextField } from "@mui/material"
import { getAuth, getIdTokenResult } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"

export default function Home() {
  const auth = getAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const router = useRouter()

  const onLoginClick = () => {
    signIn(email, password);
  }

  useEffect(() => {
    if (error) alert(error.message)
  }, [error]);

  if (user) {
    getIdTokenResult(user.user).then((result) => {
      if (result.claims.role === "student") router.replace("/student")
      else if (result.claims.role === "instructor") router.replace("/instructor")
      else router.replace("/admin")
    })
  }

  return (
    <Box>
      <AppBar position={"sticky"}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Login
          </Typography>
        </Toolbar>
      </AppBar>
      <Box paddingTop={10}>
        <Paper variant={"outlined"} style={{ padding: 20, textAlign: "center" }}>
          <Typography variant="h3" paddingBottom={4}>
            Login
          </Typography>

          <TextField style={{ paddingBottom: 20 }} label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <TextField style={{ paddingBottom: 40 }} label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <Button variant={"contained"} onClick={onLoginClick}>Login</Button>
        </Paper>
      </Box>
    </Box>
  )
}
