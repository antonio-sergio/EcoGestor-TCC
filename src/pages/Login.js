import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../services/auth/AuthContext";
import { TextField, Button, Grid, Card, Box, CardContent, CardMedia, Typography } from "@mui/material";
import bg from '../assets/images/login/bg-login.jpg';
import earth from '../assets/images/login/earth2.png';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            email: email,
            password: password
        };
        try {
            await login(payload);
        } catch (error) {
            console.log(error);
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

    return (
        <Grid container justifyContent="center" alignItems="center" height="100vh">
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

                <Grid item xs={12} sm={9} md={4} height="75vh" display="flex" justifyContent="center" alignItems="center" p={4} sx={{ backgroundColor: '#3CB371', borderRadius: '10px' }}>
                    <form onSubmit={loginSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    color="success"
                                    inputProps={{ style: { color: '#98FB96' } }}
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
                                    inputProps={{ style: { color: '#98FB96' } }}
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={handlePassword}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="primary" sx={{ background: '#98FB80', color: 'green' }} fullWidth>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Login;
