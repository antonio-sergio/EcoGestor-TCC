import AuthContext from "../services/auth/AuthContext";
import { useContext, useEffect, useState } from 'react';
import userService from "../services/user/user-service";
import UserImage from "../components/render/UserImage";
import ThemeContext from "../components/style/ThemeContext";
import { styled } from '@mui/material/styles';
import { Container, Button, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Grid, Card, CardMedia, Typography } from '@mui/material';
import { LocalShipping, AddCircle, FormatListBulleted, AccountBox as AccountBoxIcon, ExitToApp as ExitToAppIcon, KeyboardArrowRight, KeyboardArrowLeft, PointOfSale, Equalizer, ShoppingCart } from '@mui/icons-material';
import logo from "../assets/images/mark/logo2.png";
import Profile from "./Profile";
import Sales from "./Sales";
import ThemeToggleButton from "../components/style/ThemeToggleButton";
import Footer from "../components/render/Footer";
import Purchases from "./Purchases";
import BI from "./BI";
import Lists from "./Lists";
import Register from "./Register";
import Collects from "./Collects";
import { Link } from "react-router-dom";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 50px)',
}));

const StyledNav = styled(Box)(({ theme, expanded }) => ({
  width: expanded === 'true' ? '220px' : '65px',
  transition: 'width 0.3s ease',
  color: 'white',
  background: theme.palette.primary.main,
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  // Adiciona margem automática para ficar na parte inferior
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

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 50px)', // Desconta a altura do NavBar e do Footer
  width: '100%'
}));

const Bar = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.primary.main,
  height: '25px',
  width: "100%"
}));

const ContainerRenderItem = styled(Card)(({ theme }) => ({
  background: theme.palette.background.main,
  flex: 1
}));

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { logout, user } = useContext(AuthContext);
  const [dataImage, setDataImage] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('bi');


  useEffect(() => {
    userService.getUserImage(user?.id).then(response => {
      if (response.status === 200) {
        setDataImage(response.data)
      }
    })
  }, [user?.id])

  const toggleNav = () => {
    setExpanded(!expanded);
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    if (selectedComponent === 'sales') {
      return <Sales handleComponentClick={handleComponentClick} />;
    } else if (selectedComponent === 'purchases') {
      return <Purchases handleComponentClick={handleComponentClick} />;
    } else if (selectedComponent === 'profile') {
      return <Profile />;
    } if (selectedComponent === 'lists') {
      return <Lists />;
    } else if (selectedComponent === 'register') {
      return <Register />;
    } else if (selectedComponent === 'collects') {
      return <Collects handleComponentClick={handleComponentClick} />
    } else if (selectedComponent === 'bi') {
      return <BI handleComponentClick={handleComponentClick} />;
    }
  };


  return (
    <Box>
      <Bar theme={theme}>
        <Button variant="contained" color="success" sx={{ backgroundColor: 'white', maxWidth: '15px', height: '20px' }} onClick={toggleNav}>
          {expanded === true ? <KeyboardArrowLeft style={{ fontSize: '12px', color: '#753BBD', width: "10px" }} /> : <KeyboardArrowRight style={{ fontSize: '12px', color: '#753BBD', width: "10px" }} />}
        </Button>
        <Typography className="tracking-out-expand" fontSize={22} fontFamily="monospace" color='white'>
          Juntos, podemos fazer a diferença!
        </Typography>
        <Box mr={1} >
          <a href="/Landing" target="_blank" rel="noopener noreferrer" style={{ color: "white", marginRight: 6 }}>
            Site
          </a>
          <ThemeToggleButton />
        </Box>
      </Bar>
      <StyledContainer >
        <StyledNav theme={theme} expanded={expanded.toString()}>
          <StyledList>
            {expanded === true && <Card>
              <CardMedia
                component="img"
                alt="Logomarca da EcoGestor"
                height="100"
                image={logo}
              />
            </Card>}
            {expanded === true && <UserImage imageUrl={dataImage.imageUrl} />}

            <StyledListItem button onClick={() => handleComponentClick('bi')} sx={{ backgroundColor: selectedComponent === 'bi' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <Equalizer />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="BI" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('sales')} sx={{ backgroundColor: selectedComponent === 'sales' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <PointOfSale />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Venda" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('purchases')} sx={{ backgroundColor: selectedComponent === 'purchases' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <ShoppingCart />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Compra" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('collects')} sx={{ backgroundColor: selectedComponent === 'collects' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <LocalShipping />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Solicitações" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('lists')} sx={{ backgroundColor: selectedComponent === 'lists' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <FormatListBulleted />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Listas" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('register')} sx={{ backgroundColor: selectedComponent === 'register' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <AddCircle />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Cadastros" />}
            </StyledListItem>

            <StyledListItem button onClick={() => handleComponentClick('profile')} sx={{ backgroundColor: selectedComponent === 'profile' ? '#0b7b38' : '' }}>
              <StyledListItemIcon>
                <AccountBoxIcon />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Perfil" />}
            </StyledListItem>



          </StyledList>
          <StyledDivider />
          <StyledList>
            <StyledListItem button onClick={logout}>
              <StyledListItemIcon >
                <ExitToAppIcon />
              </StyledListItemIcon>
              {expanded === true && <StyledListItemText primary="Sair" />}
            </StyledListItem>
          </StyledList>
        </StyledNav>
        <ContentContainer>
          <ContainerRenderItem theme={theme}>
            {renderComponent()}
          </ContainerRenderItem>
        </ContentContainer>
      </StyledContainer>
      <Footer />
    </Box>

  );
}

export default Home;
