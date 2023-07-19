import { Grid, Tabs, Tab, Typography, Box } from '@mui/material';
import { useContext, useState } from 'react';
import PendingRequestsList from '../components/lists/PendingRequestsList';
import WaitingApprovalList from '../components/lists/WaitingApprovalList';
import DisapprovedList from '../components/lists/DisapprovedList';
import CompletedList from '../components/lists/CompletedList';
import ThemeContext from '../components/style/ThemeContext';

const Lists = () => {
    const [value, setValue] = useState(0);
    const { theme } = useContext(ThemeContext);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Grid container p={2} spacing={2} justifyContent="center"> {/* Centraliza os Grids horizontalmente */}
            <Grid item xs={12} p={3}>
                <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="h5" component="h2">
                    Solicitações
                </Typography>
            </Grid>
            <Tabs value={value} onChange={handleChange} TabIndicatorProps={{
                style: { backgroundColor: 'green'}
            }}>

                <Tab label="Aguardando Aprovação" sx={{
                    '&.Mui-selected': {
                        color:  'blue'
                    }, color: theme?.palette?.type === 'dark' ? 'green' : ''
                }} />
                <Tab label="Aprovadas" sx={{
                    '&.Mui-selected': {
                        color: 'DarkTurquoise'
                    }, color: theme?.palette?.type === 'dark' ? 'green' : ''
                }} />
                <Tab label="Recusadas" sx={{
                    '&.Mui-selected': {
                        color: 'red'
                    }, color: theme?.palette?.type === 'dark' ? 'green' : ''
                }} />
                <Tab label="Realizadas" sx={{
                    '&.Mui-selected': {
                        color: 'green'
                    }, color: theme?.palette?.type === 'dark' ? 'green' : ''
                }} />


            </Tabs>
            <Box sx={{ width: '80vw' }}>
                <Box sx={{ p: 3,color: theme?.palette?.type === 'dark' ? 'green' : ''}}>
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