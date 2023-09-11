import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import PendingRequestsList from '../components/lists/PendingRequestsList';
import WaitingApprovalList from '../components/lists/WaitingApprovalList';
import DisapprovedList from '../components/lists/DisapprovedList';
import CompletedList from '../components/lists/CompletedList';

const Lists = () => {
    const [selectedList, setSelectedList] = useState('waitingApproval');

    const handleCardClick = (listType) => {
        setSelectedList(listType);
    };

    return (
        <Grid container spacing={2}>
            
            <Grid item xs={6} sm={3} mt={2}>
                <Card
                    
                    onClick={() => handleCardClick('waitingApproval')}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedList === 'waitingApproval' ? '#84f9c2':'#27AB6E',
                        marginLeft: 2,
                        marginRight: 2
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" textAlign="center" color={selectedList === 'waitingApproval' ? 'black' : 'white'}>Aguardando Aprovação</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6} sm={3} mt={2}>
                <Card
                    onClick={() => handleCardClick('pendingRequests')}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedList === 'pendingRequests' ? '#84f9c2' : '#27AB6E' ,
                        marginLeft: 2,
                        marginRight: 2
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" textAlign="center"  color={selectedList === 'pendingRequests' ? 'black' : 'white'}>Aprovadas</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6} sm={3} mt={2}>
                <Card
                    onClick={() => handleCardClick('disapproved')}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedList === 'disapproved' ? '#84f9c2' :'#27AB6E',
                        marginLeft: 2,
                        marginRight: 2
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" textAlign="center"  color={selectedList === 'disapproved' ? 'black' : 'white'}>Recusadas</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6} sm={3} mt={2}>
                <Card
                    onClick={() => handleCardClick('completed')}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedList === 'completed' ? '#84f9c2' : '#27AB6E' ,
                        marginLeft: 2,
                        marginRight: 2
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" textAlign="center"  color={selectedList === 'completed' ? 'black' : 'white'}>Realizadas</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} p={3} m={2} >
                {selectedList === 'waitingApproval' && <WaitingApprovalList />}
                {selectedList === 'pendingRequests' && <PendingRequestsList />}
                {selectedList === 'disapproved' && <DisapprovedList />}
                {selectedList === 'completed' && <CompletedList />}
            </Grid>
        </Grid>
    );
};

export default Lists;
