import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { InboxIcon, MailIcon } from "lucide-react";
import { useEffect } from "react";
export default function QueueTray({ isOpen, setIsOpen, queue = [] }) {
  useEffect(() => {
    console.log("+++ Queue:", queue);
  }, [queue]);

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>
        {queue?.map(({ title, artist }, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={`${title} - ${artist}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor={"bottom"} open={isOpen} onClose={() => setIsOpen(false)}>
      {list("bottom")}
    </Drawer>
  );
}
