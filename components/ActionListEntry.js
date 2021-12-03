//@ts-check

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useRouter } from "next/router"

const ActionListEntry = ({ icon, to, text }) => {
  const router = useRouter()

  return (
    <ListItemButton>
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText onClick={() => router.push(to)}>
        { text }
      </ListItemText>
    </ListItemButton>
  )
}

export default ActionListEntry