import { Grid, Button, Tabs, Tab, Card, Typography, Box } from '@mui/material';
import { useContext, useState } from 'react';
import ThemeContext from '../components/style/ThemeContext';
import UserForm from '../components/forms/UserForm';
import ProductForm from '../components/forms/ProductForm';

const Register = () => {
    const { theme } = useContext(ThemeContext);
    const [value, setValue] = useState(0);
    
    const cardStyle = {
        background: theme.palette.background.main,
        color: theme.palette.teste.main
    };


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Grid container p={2}  spacing={2} justifyContent="center"> {/* Centraliza os Grids horizontalmente */}
            <Grid item xs={12} p={3}>
                <Typography variant="h5" component="h2">
                    Tela de Cadastros
                </Typography>
            </Grid>
            <Tabs value={value} onChange={handleChange}  TabIndicatorProps={{
                style: { backgroundColor: 'green' } 
            }}>
                <Tab label="Usuário" sx={{
                    '&.Mui-selected': {
                        color: 'green' 
                    }
                }} />
                <Tab label="Produto" sx={{
                    '&.Mui-selected': {
                        color: 'green' 
                    }
                }} />
            </Tabs>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ p: 3 }}>
                    {value === 0 && <UserForm />}
                    {value === 1 && <ProductForm />}
                </Box>
            </Box>
        </Grid >
    );
}

export default Register;