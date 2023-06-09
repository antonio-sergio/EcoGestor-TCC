import { Grid, Button, Tabs, Tab, Card, Typography, Box } from '@mui/material';
import { useContext, useState } from 'react';
import ThemeContext from '../components/style/ThemeContext';
import UsersList from '../components/lists/UsersList'
import ProductsList from '../components/lists/ProductList';
import PurchasesList from '../components/lists/PurchasesList';
import SalesList from '../components/lists/SalesList';
import CollectList from '../components/lists/CollectList';

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
                <Tab label="Vendas" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
                <Tab label="Compras" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
                <Tab label="Solicitações de Coleta" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
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

            </Tabs>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ p: 3 }}>
                    {value === 0 && <SalesList />}
                    {value === 1 && <PurchasesList />}
                    {value === 2 && <CollectList />}
                    {value === 3 && <UsersList />}
                    {value === 4 && <div><ProductsList /></div>}
                </Box>
            </Box>
        </Grid >
    )
}

export default Lists;