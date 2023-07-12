import React from 'react';
import { Grid, styled } from '@mui/material';

const StyledGrid = styled(Grid)({
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'green',
    height: '5vh',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    color: '#B6CAB4',
});


const Footer = () => {

    return (
        <StyledGrid>
                Developed by antonioalves.dev / Saulo Ananias
        </StyledGrid >
    );
};

export default Footer;
