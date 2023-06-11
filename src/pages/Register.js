import { Grid, Button, Card, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ThemeContext from '../components/style/ThemeContext';
import UserForm from '../components/forms/UserForm';


const Register = () => {
    const { theme } = useContext(ThemeContext);
    const [activeForm, setActiveForm] = useState('form1');

    const handleButtonClick = (form) => {
        setActiveForm(form);
    };

    const cardStyle = {
        background: theme.palette.background.main,
        color: theme.palette.teste.main
    };

    const renderForm = () => {
        if (activeForm === 'form1') {
            return (
                <Card sx={cardStyle} >
                    <Typography variant="h5" component="h2" textAlign={'center'}>
                        Cadastro de Produto
                    </Typography>
                </Card>
            );
        } else if (activeForm === 'form2') {
            return (
                <Card sx={cardStyle}>
                    <Typography variant="h5" component="h2" textAlign={'center'}>
                        Cadastro de Usuário
                    </Typography>
                    <UserForm />
                </Card>
            );
        }
    };

    return (
        <Grid container p={2} spacing={2} justifyContent="center"> {/* Centraliza os Grids horizontalmente */}
            <Grid item xs={12} p={3}>
                <Typography variant="h5" component="h2">
                    Tela de Cadastros
                </Typography>
            </Grid>
            <Grid item xs={9} sm={6} md={4}>
                <Button variant="contained" color="success" fullWidth sx={{ height: '50px' }} onClick={() => handleButtonClick('form2')}>
                    Usuários
                </Button>
            </Grid>
            <Grid item xs={9} sm={6} md={4}>
                <Button variant="contained" color="success" fullWidth sx={{ height: '50px' }} onClick={() => handleButtonClick('form1')}>
                    Produtos
                </Button>
            </Grid>

            <Grid item xs={12}>
                {renderForm()}
            </Grid>
        </Grid>
    );
}

export default Register;