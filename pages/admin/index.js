// @ts-check
import React from "react"

import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { AppBar, IconButton, Box, Button, Toolbar, Typography, List, ListSubheader, ListItem, ListItemText, ListItemButton, ListItemIcon } from "@mui/material"
import { Menu, PersonAdd } from "@mui/icons-material"

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

          <ListItemButton>
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText onClick={() => goTo("/admin/create_student")}>Add Student Account</ListItemText>
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText onClick={() => goTo("/admin/create_instructor")}>Add Instructor Account</ListItemText>
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}