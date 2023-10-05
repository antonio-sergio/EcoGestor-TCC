import React, { useState } from 'react';
import { TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { cpf as validateCPF, cnpj as validateCNPJ } from 'cpf-cnpj-validator';
import MaskedInput from 'react-text-mask';
import zipCodeService from '../../services/external/zip-code-service';
import userService from '../../services/user/user-service';
import { ToastContainer, toast } from 'react-toastify';

const UserForm = () => {
    const [userType, setUserType] = useState('seller');
    const [zipCodeMask, setZipCodeMask] = useState([/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]);
    const [zipCodeError, setZipCodeError] = useState('');
    const [zipCodeData, setZipCodeData] = useState(null);
    const [registrationUser, setRegistrationUser] = useState({
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
        type: userType
    });
    const [added, setAdded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(true);
  

    const handleChange = (e) => {
        setRegistrationUser((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    const handleNewUser = () => {
        setAdded(false);
        setModalOpen(true);
    }
    const handleZipCodeChange = async (e) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, '');

        let mask;
        if (digitsOnly.length === 8) {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

            const response = await zipCodeService.searchZipCode(digitsOnly);
            if (response) {
                const { logradouro, uf, localidade, bairro } = response.data;
                setZipCodeData(response.data);

                setRegistrationUser((prevUser) => ({
                    ...prevUser,
                    street: logradouro,
                    state: uf,
                    city: localidade,
                    neighborhood: bairro,
                    zip_code: value,
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
        setRegistrationUser({
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
            type: userType
        });
        setAdded(true);
    };



    const toggleUserType = (type) => {
        setUserType(type);
        setRegistrationUser((prevUser) => ({
            ...prevUser,
            document: '',
            type: type // Set the 'type' field to the selected user type
        }));
    };


    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userType === 'seller') {
            if (!isCPFValid(registrationUser.document)) {
                return toast.warning('Por favor, informe um CPF válido.');
            }
        } else {
            if (!isCNPJValid((registrationUser.document))) {
                return toast.warning('Por favor, informe um CNPJ válido.');
            }
        }
        if(!isEmailValid(registrationUser.email)){
            return toast.warning('Por favor, informe um e-mail válido.');
        }
        if(!isPhoneValid(registrationUser.phone)){
            return toast.warning('Por favor, informe um contato válido.');
        }
        if(zipCodeError){
            return toast.warning('Por favor, informe um CEP válido.');
        }

        if (String(registrationUser.state).toLowerCase() === 'sp' && String(registrationUser.city).toLowerCase() === 'franca') {
            registrationUser.image = selectedImage;
            userService.create(registrationUser).then(response => {
                if (response.status === 201) {
                    toast.success('Usuário adicionado com sucesso!');
                    resetForm();
                }
            }).catch(error => {
                console.log(error)
                return toast.error(`${error.response.data.message}`);
            })

        } else {
            return toast.warning('Desculpe-nos! Por enquanto só é possível efetuar cadastro para a cidade de Franca-SP');
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

    const cnpjMask = [
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
        '/',
        /\d/,
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

    const isCNPJValid = (cnpj) => {
        return validateCNPJ.isValid(cnpj);
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex?.test(email);
    };

    const isPhoneValid = (phone) => {
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length === 11;
    };

    return (
        <div style={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto' }}>
            <ToastContainer />
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Escolha o Tipo de Usuário</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="userType"
                            name="userType"
                            value={userType}
                            onChange={(e) => toggleUserType(e.target.value)}
                        >
                            <FormControlLabel value="customer" control={<Radio />} label="Cliente" />
                            <FormControlLabel value="seller" control={<Radio />} label="Fornecedor" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="success">
                        Confirmar
                    </Button>
                    <Button onClick={handleModalClose} color="primary">
                        Voltar
                    </Button>
                </DialogActions>
            </Dialog>
            {added === false ? (
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{ justifyContent: 'center', overflow: 'auto' }} spacing={2}>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Nome"
                                name="name"
                                value={registrationUser.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label={userType === 'customer' ? 'CNPJ' : 'CPF'}
                                name="document"
                                value={registrationUser.document}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputProps={{
                                    inputComponent: MaskedInput,
                                    inputProps: {
                                        mask: userType === 'seller' ? cpfMask : cnpjMask,
                                    },
                                }}
                                error={
                                    registrationUser.document &&
                                    (userType === 'seller' ? !isCPFValid(registrationUser.document) : !isCNPJValid(registrationUser.document))
                                }
                                helperText={
                                    registrationUser.document &&
                                    (userType === 'seller'
                                        ? !isCPFValid(registrationUser.document)
                                            ? 'CPF inválido'
                                            : ''
                                        : !isCNPJValid(registrationUser.document)
                                            ? 'CNPJ inválido'
                                            : '')
                                }
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Email"
                                name="email"
                                value={registrationUser.email}
                                onChange={handleChange}
                                required
                                fullWidth
                                error={registrationUser.email && !isEmailValid(registrationUser.email)}
                                helperText={
                                    registrationUser.email && !isEmailValid(registrationUser.email)
                                        ? 'Email inválido'
                                        : ''
                                }
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Contato"
                                name="phone"
                                value={registrationUser.phone}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputProps={{
                                    inputComponent: MaskedInput,
                                    inputProps: {
                                        mask: phoneMask,
                                    },
                                }}
                                error={registrationUser.phone && !isPhoneValid(registrationUser.phone)}
                                helperText={
                                    registrationUser.phone && !isPhoneValid(registrationUser.phone)
                                        ? 'Telefone inválido'
                                        : ''
                                }
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                required
                                label="CEP"
                                name="zip_code"
                                defaultValue={registrationUser.zip_code}
                                onChange={handleZipCodeChange}
                                fullWidth
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
                                type="text"
                                name="street"
                                value={registrationUser.street}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Bairro"
                                name="neighborhood"
                                value={registrationUser.neighborhood}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Cidade"
                                name="city"
                                type="text"
                                onChange={handleChange}
                                required
                                value={registrationUser.city}
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Estado"
                                name="state"
                                value={registrationUser.state}
                                onChange={handleChange}
                                required
                                fullWidth
                                inputProps={{ maxLength: 2 }}
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Número"
                                name="number"
                                type="number"
                                value={registrationUser.number}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Complemento"
                                name="complement"
                                value={registrationUser.complement}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Img"
                                name="image"
                                type="file"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                label="Senha"
                                name="password"
                                type="password"
                                value={registrationUser.password}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                            <Button sx={{ height: 53 }} type="submit" variant="contained" color="success" fullWidth>
                                Adicionar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <Grid
                    container
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 450px)',
                    }}
                >
                    <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                        <Button
                            sx={{ height: 53 }}
                            type="button"
                            onClick={() => handleNewUser()}
                            variant="contained"
                            color="success"
                            fullWidth
                        >
                            Adicionar novo usuário
                        </Button>
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

export default UserForm;
