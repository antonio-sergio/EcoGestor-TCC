import React from 'react';
import userProfile from '../../assets/images/user/user-profile.jpg'
import { Grid, styled } from '@mui/material';

const ImgProfile = styled('img')({
  width: '150px',
  height: '150px',
  objectFit: 'cover',
});

const StyledGrid = styled(Grid)({
  backgroundColor: 'black',
  padding: '10px',
});

const UserImage = ({ imageUrl }) => {
  return (
    <StyledGrid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <ImgProfile src={imageUrl ? imageUrl : userProfile} alt="User" />
      </Grid>
    </StyledGrid>
  );
};


export default UserImage;
