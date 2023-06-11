import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { cpf as validateCPF } from 'cpf-cnpj-validator';
import MaskedInput from 'react-text-mask';
import zipCodeService from '../../services/external/zip-code-service';
import userService from '../../services/user/user-service';
import addressService from '../../services/address/address-service';

import { ToastContainer, toast } from 'react-toastify';

const UserForm = () => {
    const [zipCodeMask, setZipCodeMask] = useState([/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]);
    const [zipCodeError, setZipCodeError] = useState('');
    const [zipCodeData, setZipCodeData] = useState(null);
    const [user, setUser] = useState({
        name: '',
        cpf: '',
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


    const handleChange = (e) => {
        setUser((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    const handleZipCodeChange = async (e) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Define a máscara baseada na quantidade de dígitos inseridos
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

        const isValid = digitsOnly.length === 8; // Verifica se a quantidade de dígitos é igual a 8

        // Define a mensagem de erro condicional
        setZipCodeError(isValid ? '' : 'CEP inválido');
    };

    const resetForm = () => {
        setUser({
            name: '',
            cpf: '',
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
            address_id: ''
        });
        setAdded(true);
    };

    function extrairNumeros(string) {
        // eslint-disable-next-line
        var regex = /\d+[\+\.,]?\d*|-\d+[\+\.,]?\d*/g;
        var numeros = string.match(regex);
        if (numeros) {
            numeros = numeros.map(function (num) {
                return num.replace(/[-]/g, '');
            });
        } else {
            numeros = [];
        }
        return numeros[0] + numeros[1];
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const address = {
            street: user.street,
            number: user.number,
            city: user.city,
            state: user.state,
            zip_code: extrairNumeros(user.zip_code),
            complement: user.complement,
            neighborhood: user.neighborhood
        }

        addressService.create(address).then(response => {
            console.log('response addres', response)
            if (response.status === 201) {
                user.address_id = Number(response?.data?.id_address);
                console.log('user apos addres', user)
                userService.create(user).then(response => {
                    if (response.status === 201) {
                        toast.success('Usuário adicionado com sucesso!');
                        resetForm();
                    }
                }).catch(error => {
                    toast.error(`${error.response.data.message}`);
                    addressService.delete(user.address_id).then(response => {
                        console.log('response delete adddres', response)
                    })
                    console.log(error)
                })

            }
        }).catch(
            error => {
                console.log(error);
                toast.error(`${error.response.data.message}`);

            }
        )
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
        <div style={{ maxHeight: 'calc(100vh - 450px)', overflow: 'auto' }}>
            <ToastContainer />
            {added === false ? <form onSubmit={handleSubmit}>
                <Grid container sx={{ justifyContent: 'center', overflow: 'auto' }} spacing={2}>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            label="Nome"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            label="CPF"
                            name="cpf"
                            value={user.cpf}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputProps={{
                                inputComponent: MaskedInput,
                                inputProps: {
                                    mask: cpfMask,
                                },
                            }}
                            error={user.cpf && !isCPFValid(user.cpf)}
                            helperText={user.cpf && !isCPFValid(user.cpf) ? 'CPF inválido' : ''}
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
                            label="Rua"
                            type='text'
                            name="street"
                            value={user.street}
                            onChange={handleChange}
                            required
                            fullWidth
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
                        />
                    </Grid>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            label="Complemento"
                            name="complement"
                            value={user.complement}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            label="Img"
                            name="image"
                            type='file'
                            onChange={handleChange}
                            value={user.image}
                            fullWidth
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
                        />
                    </Grid>

                    <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                        <Button sx={{ height: 53 }} type="submit" variant="contained" color="success" fullWidth>
                            adicionar
                        </Button>
                    </Grid>
                </Grid>
            </form> : <Grid
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
                        onClick={() => setAdded(false)}
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        adicionar novo usuário
                    </Button>
                </Grid>
            </Grid>}
        </div >
    );
};

export default UserForm;
