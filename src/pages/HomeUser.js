import { Grid, Typography, Button, Box, Container, AppBar, Toolbar, } from "@mui/material";
import CollectForm from "../components/forms/CollectRequestForm";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/auth/AuthContext";
import MyCollectRequestList from "../components/lists/MyCollectRequestList";
import Profile from "./Profile";
import MySales from "../components/lists/MySales";
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
        } else if (selectedComponent === 'myRequests') {
            return <MyCollectRequestList />
        } else if (selectedComponent === 'profile') {
            return <Profile color={"#fff"} />
        } else if (selectedComponent === 'mysales') {
            return <MySales />
        }
    };

    return (
        <Box sx={{ backgroundColor: "#fff", height: "100%"}}>
            <AppBar position="fixed" sx={{ backgroundColor: "#27AB6E", height: "10vh", minHeight: "90px", display: "flex", justifyContent: "center" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box >
                        <Typography style={{ fontFamily: 'Belanosima, sans-serif' }} variant="h5" component="h2" align="center" color="white" fontSize="50px">
                            ECOGESTOR
                        </Typography>
                    </Box>
                    <Box display="flex" >
                        <UserImage color="#27AB6E" imageUrl={dataImage.imageUrl} />
                        <Button color="inherit" onClick={() => logout()}><Link to="/Login"><LogoutIcon sx={{ color: "#B22222", fontSize: 40 }} /></Link></Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={2} mt={5}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom sx={{ color: "#27AB6E", fontWeight: 700 }}>
                            Sistema de Coleta
                        </Typography>
                        <Typography variant="body1" gutterBottom >
                            Aqui você pode solicitar coletas, gerenciar suas solicitações e
                            editar seu perfil.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant={selectedComponent === 'collectForm' ? 'contained' : 'outlined'}
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick('collectForm')}
                        >
                            Solicitar Coleta
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant={selectedComponent === 'myRequests' ? 'contained' : 'outlined'}
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick("myRequests")}
                        >
                            Minhas Solicitações
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant={selectedComponent === 'profile' ? 'contained' : 'outlined'}
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick("profile")}
                        >
                            Meu Perfil
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant={selectedComponent === 'mysales' ? 'contained' : 'outlined'}
                            color="success"
                            size="large"
                            fullWidth
                            onClick={() => handleComponentClick("mysales")}
                        >
                            Minhas Vendas
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Container sx={{ display: "flex", height: "100%", justifyContent: "flex-start", alignItems: "center" }}>

                {renderComponent()}
            </Container>


        </Box>
    )
}

export default HomeUser;