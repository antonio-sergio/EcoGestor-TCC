import React from 'react';
import { Grid, styled, Card } from '@mui/material';

const StyledGrid = styled(Grid)({
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'green',
    height: '100px',

});


const NavBar = () => {

    return (
        <StyledGrid>
            <Card>
                testes
            </Card>
        </StyledGrid >
    );
};

export default NavBar;
