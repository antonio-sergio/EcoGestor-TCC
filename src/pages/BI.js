import React, { useEffect, useState } from 'react';
import { Grid, Container, Card, CardContent, Typography, Box } from '@mui/material';
import moment from 'moment';
import saleService from '../services/sale/sale-service';
import purchaseService from '../services/purchase/purchase-service';
import collectService from '../services/collect/collect-service';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AnnualTransactions from '../components/graphics/AnnualTransactions';

const BIComponent = ({ handleComponentClick }) => {
    const [dateObject, setDateObject] = useState({
        startDate: moment().add(1, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(1, 'days').format('YYYY-MM-DD')
    });
    const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
    const [totalSale, setTotalSale] = useState([]);
    const [totalPurchase, setTotalPurchase] = useState([]);
    const [collectsToday, setCollectsToday] = useState([]);
    const [collectsWaiting, setCollectsWaiting] = useState([]);

   
    useEffect(() => {
        saleService.getTotalSale(dateObject).then(response => {
            if (response.status === 200) {
                setTotalSale(response.data);
            }
        })
    }, []);

    useEffect(() => {
        purchaseService.getTotalPurchase(dateObject).then(response => {
            if (response.status === 200) {
                setTotalPurchase(response.data);
            }
        })
    }, []);

    useEffect(() => {
        collectService.getCollectsByDate(today).then(response => {
            if (response.status === 200) {
                const filteredData = response.data.filter(item => item.status === 'pendente');
                setCollectsToday(filteredData);
            }
        })
    }, []);

    useEffect(() => {
        collectService.getCollectsByStatus('aguardando').then(response => {
            if (response.status === 200) {
                setCollectsWaiting(response.data)
            }
        })
    }, []);



    return (
        <Container maxWidth="100%" sx={{ marginTop: 4 }}>
            <Grid container height={100} spacing={3}>

                <Grid item xs={9} sm={4} md={3} onClick={() => handleComponentClick('sales')}>
                    <Card sx={{ height: 100, display: 'flex', justifyContent: "center", alignItems: 'space-around', flexDirection: 'column', backgroundColor: '#00C853' }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item xs={12} md={4} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <SavingsIcon sx={{ color: 'white', fontSize: '60px' }} />
                                </Grid>
                                <Grid item xs={12} md={8} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <Typography color="white">{totalSale?.saleCount || 0} Vendas</Typography>
                                    <Typography fontSize={30} color="white">R$: {totalSale?.totalSum || 0}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={9} sm={6} md={3} onClick={() => handleComponentClick('purchases')}>
                    <Card sx={{ height: 100, display: 'flex', justifyContent: "center", alignItems: 'space-around', flexDirection: 'column', backgroundColor: '#FF1744' }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item xs={12} md={4} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <ShoppingCartIcon sx={{ color: 'white', fontSize: '60px' }} />
                                </Grid>
                                <Grid item xs={12} md={8} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <Typography color="white">{totalPurchase?.purchaseCount || 0} Compras</Typography>
                                    <Typography fontSize={30} color="white">R$: {totalPurchase?.totalSum || 0}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={9} sm={6} md={3} onClick={() => handleComponentClick('collects')}>
                    <Card sx={{ height: 100, display: 'flex', justifyContent: "center", alignItems: 'space-around', flexDirection: 'column', backgroundColor: '#CCCC00' }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item xs={12} md={4} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <LocalShippingIcon sx={{ color: 'white', fontSize: '60px' }} />
                                </Grid>
                                <Grid item xs={12} md={8} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                    <Typography color="white">Coletas</Typography>
                                    <Typography fontSize={30} color="white">{collectsToday.length}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                    <Grid item xs={9} sm={6} md={3} onClick={() => handleComponentClick('collects')}>
                        <Card sx={{ height: 100, display: 'flex', justifyContent: "center", alignItems: 'space-around', flexDirection: 'column', backgroundColor: '#2196F3' }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={12} md={4} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                        <AccessTimeFilledIcon sx={{ color: 'white', fontSize: '60px' }} />
                                    </Grid>
                                    <Grid item xs={12} md={8} height={130} textAlign="center" display="flex" justifyContent="center" flexDirection={'column'} alignItems="flex-start">
                                        <Typography color="white">Aguardando Aprovação</Typography>
                                        <Typography fontSize={30} color="white">{collectsWaiting.length}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
            </Grid>
            <Box sx={{ width: 600, height: 300, marginTop: 5 }} >
                <AnnualTransactions />
            </Box>
        </Container>
    );
};

export default BIComponent;
