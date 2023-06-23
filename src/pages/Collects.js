import { Grid, Button, Tabs, Tab, Card, Typography, Box } from '@mui/material';
import { useContext, useState } from 'react';
import ThemeContext from '../components/style/ThemeContext';
import UsersList from '../components/lists/UsersList'
import ProductsList from '../components/lists/ProductList';
import PurchasesList from '../components/lists/PurchasesList';
import SalesList from '../components/lists/SalesList';
import PendingRequestsList from '../components/lists/PendingRequestsList';
import WaitingApprovalList from '../components/lists/WaitingApprovalList';
import DisapprovedList from '../components/lists/DisapprovedList';
import CompletedList from '../components/lists/CompletedList';

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
                    Solicitações
                </Typography>
            </Grid>
            <Tabs value={value} onChange={handleChange} TabIndicatorProps={{
                style: { backgroundColor: 'green' }
            }}>
                
                <Tab label="Aguardando Aprovação" sx={{
                    '&.Mui-selected': {
                        color: 'blue'
                    }
                }} />
                <Tab label="Aprovadas" sx={{
                    '&.Mui-selected': {
                        color: 'DarkTurquoise'
                    }
                }} />
                <Tab label="Recusadas" sx={{
                    '&.Mui-selected': {
                        color: 'red'
                    }
                }} />
                <Tab label="Realizadas" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }
                }} />
                

            </Tabs>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ p: 3 }}>
                    {value === 0 && <WaitingApprovalList />}
                    {value === 1 && <PendingRequestsList />}
                    {value === 2 && <DisapprovedList />}
                    {value === 3 && <CompletedList />}
                </Box>
            </Box>
        </Grid >
    )
}

export default Lists;