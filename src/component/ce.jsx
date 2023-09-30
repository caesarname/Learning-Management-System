import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const SideBar = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

const SideBarContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const SideBarList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const SideBarListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const SideBarListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(1),
}));

export const SidePage = () => {
  return (
    <SideBar variant="permanent" anchor="left">
      <SideBarContent>
        <SideBarList>
          <SideBarListItem>
            <SideBarListItemIcon>
              <Icon />
            </SideBarListItemIcon>
            <ListItemText primary="name" />
          </SideBarListItem>
          <SideBarListItem>
            <SideBarListItemIcon>
              <Icon />
            </SideBarListItemIcon>
            <ListItemText primary="size" />
          </SideBarListItem>
          <SideBarListItem>
            <SideBarListItemIcon>
              <Icon />
            </SideBarListItemIcon>
            <ListItemText primary="grade" />
          </SideBarListItem>
        </SideBarList>
      </SideBarContent>
    </SideBar>
  );
};
