import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import PendingRequestsList from '../components/lists/PendingRequestsList';
import WaitingApprovalList from '../components/lists/WaitingApprovalList';
import DisapprovedList from '../components/lists/DisapprovedList';
import CompletedList from '../components/lists/CompletedList';
import { CheckCircleOutline, HourglassTop, ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material';

const Lists = () => {
    const [selectedList, setSelectedList] = useState('waitingApproval');

    const handleCardClick = (listType) => {
        setSelectedList(listType);
    };

    return (
        <Box width="98%" display="flex" justifyContent="center" alignItems="center">
            <Grid container spacing={2} mt={2} >

                <Grid item xs={6} sm={3} >
                    <Button
                        fullWidth
                        variant={selectedList === 'waitingApproval' ? 'contained' : 'outlined'}
                        color='success'
                        onClick={() => handleCardClick('waitingApproval')}
                        sx={{
                            cursor: 'pointer',
                            margin: 2,
                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                            <HourglassTop sx={{ color: selectedList === 'waitingApproval' ? 'white' : 'green' }} />
                            <Typography variant="h5" textAlign="center" color={selectedList === 'waitingApproval' ? 'white' : 'green'}>Aguardando</Typography>
                        </CardContent>
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3} >
                    <Button
                        fullWidth
                        variant={selectedList === 'pendingRequests' ? 'contained' : 'outlined'}
                        color='success'
                        onClick={() => handleCardClick('pendingRequests')}
                        sx={{
                            cursor: 'pointer',
                            margin: 2,

                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                            <ThumbUpAlt sx={{ color: selectedList === 'pendingRequests' ? 'white' : 'green' }} />
                            <Typography variant="h5" ml={1} textAlign="center" color={selectedList === 'pendingRequests' ? 'white' : 'green'}>Aprovadas</Typography>
                        </CardContent>
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3} >
                    <Button
                        fullWidth
                        variant={selectedList === 'disapproved' ? 'contained' : 'outlined'}
                        onClick={() => handleCardClick('disapproved')}
                        color='success'
                        sx={{
                            cursor: 'pointer',
                            margin: 2,

                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                            <ThumbDownAlt sx={{ color: selectedList === 'disapproved' ? 'white' : 'green' }} />
                            <Typography variant="h5" ml={1} textAlign="center" color={selectedList === 'disapproved' ? 'white' : 'green'}>Recusadas</Typography>
                        </CardContent>
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3} >
                    <Button
                        fullWidth
                        variant={selectedList === 'completed' ? 'contained' : 'outlined'}
                        onClick={() => handleCardClick('completed')}
                        color='success'
                        sx={{
                            cursor: 'pointer',
                            margin: 2,

                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleOutline sx={{ color: selectedList === 'completed' ? 'white' : 'green' }} />
                            <Typography variant="h5" ml={1} textAlign="center" color={selectedList === 'completed' ? 'white' : 'green'}>Realizadas</Typography>
                        </CardContent>
                    </Button>
                </Grid>
                <Grid item xs={12} p={3} m={2} >
                    {selectedList === 'waitingApproval' && <WaitingApprovalList />}
                    {selectedList === 'pendingRequests' && <PendingRequestsList />}
                    {selectedList === 'disapproved' && <DisapprovedList />}
                    {selectedList === 'completed' && <CompletedList />}
                </Grid>
            </Grid>
        </Box>

    );
};

export default Lists;
