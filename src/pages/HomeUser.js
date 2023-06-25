import { Grid, Typography, Button, Box, Container, AppBar, Toolbar, } from "@mui/material";
import CollectForm from "../components/forms/CollectRequestForm";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/auth/AuthContext";

const HomeUser = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const { logout, user } = useContext(AuthContext);

    const handleComponentClick = (component) => {
        setSelectedComponent(component);
    };
    const renderComponent = () => {
        if (selectedComponent === 'collectForm') {
            return <CollectForm />;
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
                    <Box>
                        <Button color="inherit" onClick={() => logout()}><Link to="/Login" style={{ color: "white" }}>Logoff</Link></Button>
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
                            onClick={() => handleComponentClick("")}
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
                            onClick={() => handleComponentClick("")}
                        >
                            Meu Perfil
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Container sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>

                {renderComponent()}
            </Container>


        </Box>
    )
}

export default HomeUser;