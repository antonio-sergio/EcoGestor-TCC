import AuthContext from "../services/auth/AuthContext";
import { useContext, useEffect, useState } from 'react';
import userService from "../services/user/user-service";
import UserImage from "../components/render/UserImage";
import ThemeContext from "../components/style/ThemeContext";
import { styled } from '@mui/material/styles';
import { Container, Button, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home as HomeIcon, AccountBox as AccountBoxIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  height: '100vh', 
  justifyContent: 'flex-start',
}));

const StyledNav = styled(Box)(({ theme, expanded }) => ({
  width: expanded ? '200px' : '50px',
  transition: 'width 0.3s ease',
  color: theme.palette.common.white,
  background: 'blue',
  left: 0,
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const StyledListItemText = styled(ListItemText)({
  display: 'flex',
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { logout, user } = useContext(AuthContext);
  const [dataImage, setDataImage] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    userService.getUserImage(user.id).then(response => {
      if (response.status === 200) {
        setDataImage(response.data)
      }
    })
  }, [user.id])

  const toggleNav = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledContainer  maxWidth={true}>
      <StyledNav p={2} expanded={expanded}>
        <StyledList>
          <StyledListItem button>
            <StyledListItemIcon>
              <HomeIcon />
            </StyledListItemIcon>
            {expanded && <StyledListItemText primary="Home" />}
          </StyledListItem>
          <StyledListItem button>
            <StyledListItemIcon>
              <AccountBoxIcon />
            </StyledListItemIcon>
            {expanded && <StyledListItemText primary="Profile" />}
          </StyledListItem>
          <StyledListItem button>
            <StyledListItemIcon>
              <SettingsIcon />
            </StyledListItemIcon>
            {expanded && <StyledListItemText primary="Settings" />}
          </StyledListItem>
        </StyledList>
        <StyledDivider />
        <StyledList>
          <StyledListItem button onClick={logout}>
            <StyledListItemIcon>
              <ExitToAppIcon />
            </StyledListItemIcon>
            {expanded && <StyledListItemText primary="Logout" />}
          </StyledListItem>
        </StyledList>
      </StyledNav>
      <Box flex={1} paddingLeft={2}>
        <Button variant="contained" color="secondary" onClick={toggleNav}>
          {expanded ? 'Collapse' : 'Expand'}
        </Button>
        <UserImage imageUrl={dataImage.imageUrl} />
      </Box>
    </StyledContainer>
  );
}

export default Home;
