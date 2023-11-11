import React from 'react';
import userProfile from '../../assets/images/user/user-profile.jpg'
import { Grid, styled, Card, Avatar } from '@mui/material';
import AuthContext from '../../services/auth/AuthContext';
import { useContext } from 'react';
import ThemeContext from '../style/ThemeContext';

const StyledGrid = styled(Card)(({ theme }) => ({
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',  
  alignItems: 'center', 
  backgroundColor:  theme?.palette?.primary?.main,
  marginTop: 4
}));

const UserInfos = styled(Grid)({
  width: '160px',
  height: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  marginLeft: 10,
  padding: 3,

});

const Infos = styled('span')({
  fontSize: 16,
  color: 'white'
});

const UserImage = ({ imageUrl, dimension, color }) => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  function formatName() {
    const words = String(user?.name).split(' ');
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    const fullName = firstWord + " " + lastWord; 
    return fullName.toUpperCase();
  }

  return (
    <StyledGrid style={{backgroundColor: color !== undefined ? color : ""}} theme={theme}>
      <Avatar src={imageUrl ? imageUrl : userProfile} alt="User" sx={{ width: dimension || 56, height: dimension || 56}} />
      <UserInfos >
        <Infos>{formatName()}</Infos>
        {user.role === 'admin' && <Infos>{user.role}</Infos>}
      </UserInfos> 
    </StyledGrid>
  );
};

export default UserImage;
