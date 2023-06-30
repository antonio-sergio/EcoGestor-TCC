import { Grid, Typography, Button, Box, Container, AppBar, Toolbar, } from "@mui/material";
import CollectForm from "../components/forms/CollectRequestForm";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/auth/AuthContext";
import MyCollectRequestList from "../components/lists/MyCollectRequestList";
import Profile from "./Profile";
import UserImage from "../components/render/UserImage";
import userService from "../services/user/user-service";
import LogoutIcon from '@mui/icons-material/Logout';

const HomeUser = () => {
    const [selectedComponent, setSelectedComponent] = useState('collectForm');
    const { logout, user } = useContext(AuthContext);
    const [dataImage, setDataImage] = useState([]);

    useEffect(() => {
        userService.getUserImage(user?.id).then(response => {
            if (response.status === 200) {
                setDataImage(response.data)
            }
        })
    }, [user?.id])

    const handleComponentClick = (component) => {
        setSelectedComponent(component);
    };

    const renderComponent = () => {
        if (selectedComponent === 'collectForm') {
            return <CollectForm />;
        }else if(selectedComponent === 'myRequests'){
            return <MyCollectRequestList />
        }else if(selectedComponent === 'profile'){
            return <Profile />
        }
    };

    return (
        <Box sx={{ padding: "2rem" }}>
            <AppBar position="fixed" sx={{ backgroundColor: "#27AB6E", height: "10vh", display: "flex", justifyContent: "center" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box >
                        <Typography style={{ fontFamily: 'Belanosima, sans-serif' }} variant="h5" component="h2" align="center" color="white" fontSize="50px">
                            ECOGESTOR
                        </Typography>
                    </Box>
                    <Box display="flex">
                        <UserImage imageUrl={dataImage.imageUrl} />
                        <Button color="inherit" onClick={() => logout()}><Link to="/Login"><LogoutIcon sx={{color: "#B22222", fontSize: 40}} /></Link></Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={2} mt={15}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom sx={{color: "#27AB6E", fontWeight: 700}}>
                            Sistema de Coleta
                        </Typography>
                        <Typography variant="body1" gutterBottom >
                            Aqui você pode solicitar coletas, gerenciar suas solicitações e
                            editar seu perfil.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick('collectForm')}
                        >
                            Solicitar Coleta
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick("myRequests")}
                        >
                            Minhas Solicitações
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick("profile")}
                        >
                            Meu Perfil
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Container sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", height: "65vh" }}>

                {renderComponent()}
            </Container>


        </Box>
    )
}

export default HomeUser;