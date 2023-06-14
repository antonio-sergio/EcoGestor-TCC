import { Grid, Button, Tabs, Tab, Card, Typography, Box } from '@mui/material';
import { useContext, useState } from 'react';
import ThemeContext from '../components/style/ThemeContext';
import UsersList from '../components/lists/UsersList'

const Lists = () => {
    const { theme } = useContext(ThemeContext);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const cardStyle = {
        background: theme.palette.background.main,
        color: theme.palette.teste.main
    };
    return (
        <Grid container p={2} spacing={2} justifyContent="center"> {/* Centraliza os Grids horizontalmente */}
            <Grid item xs={12} p={3}>
                <Typography variant="h5" component="h2">
                    Tela de Listas
                </Typography>
            </Grid>
            <Tabs value={value} onChange={handleChange} TabIndicatorProps={{
                style: { backgroundColor: 'green' }
            }}>
                <Tab label="Usuários" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
                <Tab label="Produtos" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
                 <Tab label="Endereços" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
            </Tabs>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ p: 3 }}>
                    {value === 0 && <UsersList />}
                    {value === 1 && <div>Teste 1</div>}
                </Box>
            </Box>
        </Grid >
    )
}

export default Lists;