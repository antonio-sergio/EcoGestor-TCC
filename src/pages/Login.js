import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../services/auth/AuthContext";
import { TextField, Button, Grid, Box, CardContent, CardMedia, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import earth from '../assets/images/login/earth2.png';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import userService from "../services/user/user-service";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openModal, setOpenModal] = useState(false);


    const loginSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            email: email.trim(),
            password: password.trim()
        };
        try {
            await login(payload);
            localStorage.setItem('theme', `{"palette":{"type":"light","primary":{"main":"#27AB6E"},"secondary":{"main":"#000"},"background":{"main":"#F2F2F2"},"mode":{"main":"#27C46E"},"teste":{"main":"black"}}}`);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    const handleEmail = (e) => {
        const email = e?.target?.value;
        setEmail(email);
    };

    const handlePassword = (e) => {
        const password = e?.target?.value;
        setPassword(password);
    };

    const handleRecoveryPassword = () => {
        userService.recoveryPassword(email).then(response => {
            if (response.status === 200) {
                toast.success('Enviamos uma senha temporária para o seu email!');
                setOpenModal(false);
            }
        }).catch(error => {
            console.log(error);
            toast.error('Não foi possível recuperar a senha.')
        })
    };

    return (
        <Grid container justifyContent="center" alignItems="center" height="100vh" sx={{ backgroundColor: "#fff" }}>
            <ToastContainer />
            <Grid display="flex" width="80vw" height="70vh" justifyContent="space-around" alignItems="center" style={{
                background: "linear-gradient(to bottom, #98FB98, #27AB6E)", borderRadius: "10px",
            }}>
                <Grid xs={12} sm={9} md={4} sx={{ width: "50%" }}>
                    <Box>
                        <CardContent>
                            <Typography style={{ fontFamily: 'Belanosima, sans-serif' }} variant="h5" component="h2" align="center" color="#3CB371" fontSize="50px">
                                ECOGESTOR
                            </Typography>
                        </CardContent>
                        <CardMedia
                            className="rotate-center"
                            component="img"
                            alt="desenho da terra"
                            height="300"
                            width="300"
                            image={earth}
                            style={{ objectFit: "contain", textAlign: "center" }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={9} md={4} height="75vh" display="flex" justifyContent="space-around" alignItems="center" p={4} sx={{ backgroundColor: '#3CB371', borderRadius: '10px' }}>
                    <form onSubmit={loginSubmit}>
                        <Grid container spacing={2} height="90%" display="flex" alignItems="center" marginTop={15} justifyContent="center">
                            <Grid item xs={12}>
                                <TextField
                                    color="success"
                                    inputProps={{ style: { color: '#fff' } }}
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmail}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    color="success"
                                    inputProps={{ style: { color: '#fff' } }}
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={handlePassword}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <Button type="submit" variant="primary" sx={{ background: '#98FB80', color: 'green' }} fullWidth>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} height="100px" sx={{ position: "relative", bottom: 0 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Button type="button" sx={{ mt: 1 }} >
                                <Link style={{ color: "#98FB80" }} to="/Signup">  Ainda não possui uma conta?</Link>
                            </Button>
                            <Button type="button" >
                                <Link style={{ color: "#98FB80" }} to="/Landing">  Home</Link>
                            </Button>
                            <Button type="button" variant="outlined" color="success" onClick={() => setOpenModal(true)}>
                                  Esqueceu a senha?
                            </Button>
                        </Grid>
                    </form>

                </Grid>
            </Grid>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Recuperar Acesso
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TextField
                            label="E-mail"
                            defaultValue={''}
                            onChange={(e) => setEmail( e.target.value )}
                            fullWidth
                            margin="normal"
                        />

                    </>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={handleRecoveryPassword}>Salvar</Button>
                        <Button onClick={() => setOpenModal(false)}>Voltar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Login;
