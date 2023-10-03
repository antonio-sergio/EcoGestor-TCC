import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography
} from '@mui/material';
import { cpf as validateCPF } from 'cpf-cnpj-validator';
import MaskedInput from 'react-text-mask';
import zipCodeService from '../services/external/zip-code-service';
import userService from '../services/user/user-service';
import addressService from '../services/address/address-service';
import { ToastContainer, toast } from 'react-toastify';
import bg from "../assets/images/login/bg-login.jpg";
import { Link } from "react-router-dom";


const Signup = () => {
    const [zipCodeMask, setZipCodeMask] = useState([/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]);
    const [zipCodeError, setZipCodeError] = useState('');
    const [zipCodeData, setZipCodeData] = useState(null);
    const [user, setUser] = useState({
        name: '',
        document: '',
        email: '',
        phone: '',
        password: '',
        street: zipCodeData?.logradouro || '',
        number: '',
        city: zipCodeData?.localidade || '',
        state: zipCodeData?.uf || '',
        zip_code: '',
        complement: '',
        neighborhood: zipCodeData?.bairro || '',
        image: '',
        address_id: ''
    });
    const [added, setAdded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [open] = useState(true);

    const handleChange = (e) => {
        setUser((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    const handleZipCodeChange = async (e) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // // Define a máscara baseada na quantidade de dígitos inseridos
        let mask;
        if (digitsOnly.length === 8) {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

            // Realiza a consulta do CEP e obtém os dados
            const response = await zipCodeService.searchZipCode(digitsOnly);
            if (response) {
                const { logradouro, uf, localidade, bairro } = response.data;
                setZipCodeData(response.data);

                setUser((prevUser) => ({
                    ...prevUser,
                    street: logradouro,
                    state: uf,
                    city: localidade,
                    neighborhood: bairro,
                    zip_code: String(digitsOnly).substring(0, 8),
                }));
            } else {
                setZipCodeData(null);
            }
        } else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
            setZipCodeData(null);
        }
        setZipCodeMask(mask);


        const isValid = digitsOnly.length === 8;

        setZipCodeError(isValid ? '' : 'CEP inválido');
    };



    const resetForm = () => {
        setUser({
            name: '',
            document: '',
            email: '',
            phone: '',
            password: '',
            street: '',
            number: '',
            city: '',
            state: '',
            zip_code: '',
            complement: '',
            neighborhood: '',
            image: '',
        });
        setAdded(true);
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (String(user.state).toLowerCase() === 'sp' && String(user.city).toLowerCase() === 'franca') {
            user.image = selectedImage;
            userService.create(user).then(response => {
                if (response.status === 201) {
                    toast.success('Usuário adicionado com sucesso!');
                    resetForm();
                }
            }).catch(error => {
                toast.error(`${error.response.data.message}`);
                addressService.delete(user.address_id).then(response => {
                })
            })

        } else {
            toast.warning('Desculpe-nos! Por enquanto só é possível efetuar cadastro para a cidade de Franca-SP');
        }

    };

    const cpfMask = [
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
    ];

    const phoneMask = [
        '(',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ];

    const isCPFValid = (cpf) => {
        return validateCPF.isValid(cpf);
    };

    const isEmailValid = (email) => {
        // Expressão regular para validar o formato do email
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const isPhoneValid = (phone) => {
        // Remove caracteres não numéricos para contar apenas os dígitos
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length === 11;
    };


    return (
        <Box sx={{ height: "100vh", backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <ToastContainer />
            <Box sx={{

                width: '1000px'
            }}>
                <Dialog open={open} fullWidth maxWidth="lg" >
                    <DialogTitle><Typography style={{ fontFamily: 'Belanosima, sans-serif' }} variant="h5" component="h2" align="center" color="#3CB371" fontSize="50px">
                        ECOGESTOR
                    </Typography></DialogTitle>
                    {added === false ? <DialogContent >
                        <form onSubmit={handleSubmit}>
                            <Grid container sx={{ justifyContent: 'center', overflow: 'auto' }} spacing={2}>

                                <Grid height={14} item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Nome"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="CPF"
                                        name="document"
                                        value={user.document}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                        InputProps={{
                                            inputComponent: MaskedInput,
                                            inputProps: {
                                                mask: cpfMask,
                                            },
                                        }}
                                        error={user.document && !isCPFValid(user.document)}
                                        helperText={user.document && !isCPFValid(user.document) ? 'CPF inválido' : ''}
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                        error={user.email && !isEmailValid(user.email)}
                                        helperText={user.email && !isEmailValid(user.email) ? 'Email inválido' : ''}
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Contato"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                        InputProps={{
                                            inputComponent: MaskedInput,
                                            inputProps: {
                                                mask: phoneMask,
                                            },
                                        }}
                                        error={user.phone && !isPhoneValid(user.phone)}
                                        helperText={user.phone && !isPhoneValid(user.phone) ? 'Phone inválido' : ''}
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="CEP"
                                        name="zip_code"
                                        defaultValue={user.zip_code}
                                        onChange={handleZipCodeChange}
                                        fullWidth
                                        color='success'
                                        size='small'
                                        required
                                        InputProps={{
                                            inputComponent: MaskedInput,
                                            inputProps: {
                                                mask: zipCodeMask,
                                            },
                                        }}
                                        error={zipCodeError !== ''}
                                        helperText={zipCodeError}
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Logradouro"
                                        type='text'
                                        name="street"
                                        value={user.street}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Bairro"
                                        name="neighborhood"
                                        value={user.neighborhood}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Cidade"
                                        name="city"
                                        type='text'
                                        onChange={handleChange}
                                        required
                                        value={user.city}
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Estado"
                                        name="state"
                                        value={user.state}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                        inputProps={{ maxLength: 2 }}
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Número"
                                        name="number"
                                        type='number'
                                        value={user.number}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Complemento"
                                        name="complement"
                                        value={user.complement}
                                        onChange={handleChange}
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Img"
                                        name="image"
                                        type='file'
                                        onChange={(e) => setSelectedImage(e.target.files[0])}
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>

                                <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                                    <TextField
                                        label="Senha"
                                        name="password"
                                        type="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        color='success'
                                        size='small'
                                    />
                                </Grid>


                            </Grid>
                            <Grid container paddingTop={1} sx={{ justifyContent: 'center', overflow: 'auto' }} spacing={2}>

                                <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                                    <Button sx={{ height: 53 }} type="submit" variant="contained" color="success" fullWidth>
                                        criar conta
                                    </Button>
                                </Grid>
                                <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                                    <Button type="button" sx={{ height: 53 }} variant="outlined" color="success" fullWidth >
                                        <Link to="/Login" style={{ color: "green", height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Ir p/ Login</Link>
                                    </Button>
                                </Grid>
                                <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                                    <Button type="button" sx={{ height: 53 }} variant="outlined" color="success" fullWidth >
                                        <Link to="/Landing" style={{ color: "green", height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Home </Link>
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent> :
                        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button type="button" sx={{ backgroundColor: "#3CB371" }} >
                                <Link style={{ color: "white" }} to="/Login">Ir para a tela de login</Link>
                            </Button>
                        </DialogContent>}
                </Dialog>
            </Box>

        </Box >
    );
};




export default Signup;