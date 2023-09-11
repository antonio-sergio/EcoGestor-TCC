import React, { useContext } from 'react';
import { Grid, styled } from '@mui/material';
import ThemeContext from '../style/ThemeContext';

const StyledGrid =  styled(Grid)(({ theme }) => ({
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette?.primary?.main,
    height: '25px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    color: '#B6CAB4',

}));


const Footer = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <StyledGrid theme={theme}>
                Developed by antonioalves.dev / Saulo Ananias
        </StyledGrid >
    );
};

export default Footer;
