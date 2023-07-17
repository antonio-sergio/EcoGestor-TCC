import { useContext, useEffect, useState } from "react";
import AuthContext from "../services/auth/AuthContext";
import { Box, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import userService from "../services/user/user-service";
import addressService from "../services/address/address-service";
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from "react-toastify";
import ThemeContext from "../components/style/ThemeContext";

const Profile = ({color}) => {
  console.log('color', color)
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalPassword, setOpenModalPassword] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 
  useEffect(() => {
    userService.getUserById(user.id).then(response => {
      if (response.status === 200) {
        setDataUser(response.data);
      }
    });
  }, [user, openModal, openModalPassword]);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: 10,
    marginBottom: 2,
    backgroundColor: color !== undefined ? color : theme?.palette?.type === 'dark' ? 'black' : ''
  }));

  const handleSaveAddress = () => {
    addressService.updateAddress(selectedAddress).then(response => {
      if (response.status === 200) {
        toast.success('Endereço atualizado com sucesso!');
        setOpenModal(false);
      }
    }).catch(error => {
      console.log(error);
      toast.error('Não foi possível atualizar o endereço.')
    })
  };

  const handleSavePassword = () => {
    if (password === confirmPassword) {
      const updatedUser = { ...selectedUser, password };
      userService.updateUser(updatedUser).then(response => {
        if (response.status === 200) {
          toast.success('Senha atualizada com sucesso!');
          setOpenModalPassword(false);
        }
      }).catch(error => {
        console.log(error);
        toast.error(error?.response.data.message)
      })
    } else {
      toast.error('As senhas informadas não coincidem.');
    }
  };

  const handleEditAddress = () => {
    setSelectedAddress(dataUser?.address);
    setOpenModal(true);
  };

  const handleEditPassword = () => {
    setSelectedUser(dataUser);
    setPassword('');
    setConfirmPassword('');
    setOpenModalPassword(true);
  };

  return (
    <Grid container xs={12} width="100%" >
      <ToastContainer />
      <Box width="100%" >
        <StyledPaper  elevation={3} theme={theme}>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="h5"><strong>{String(dataUser?.name).toUpperCase()}</strong> </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">Acesso: <strong>{dataUser?.role}</strong> </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">Email: <strong>{dataUser?.email}</strong> </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="h6" mb={2}>Endereço:</Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Logradouro: <strong>{dataUser?.address.street}</strong>{" "}
              </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Número: <strong>{dataUser?.address.number}</strong>{" "}
              </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Bairro: <strong>{dataUser?.address.neighborhood}</strong>
              </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Cidade: <strong>{dataUser?.address.city}</strong>
              </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Estado: <strong>{dataUser?.address.state}</strong>
              </Typography>
              <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                Cep: <strong>{dataUser?.address.zip_code}</strong>
              </Typography >
              {dataUser?.address?.complement && (
                <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''} variant="body1">
                  Complemento: <strong>{dataUser?.address.complement}</strong>
                </Typography>
              )}
              <Button variant="contained" color="success" sx={{ marginTop: 3 }} onClick={handleEditAddress}>Editar Endereço</Button>
              <Button variant="outlined" color="success" sx={{ marginTop: 3, marginLeft: 2 }} onClick={handleEditPassword}>Editar Senha</Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
          Editar Endereço
        </DialogTitle>
        <DialogContent sx={{ marginTop: 3 }}>
          <>
            <TextField
              label="Logradouro"
              defaultValue={selectedAddress?.street || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, street: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Número"
              value={selectedAddress?.number || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, number: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bairro"
              value={selectedAddress?.neighborhood || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, neighborhood: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cidade"
              value={selectedAddress?.city || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, city: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Estado"
              value={selectedAddress?.state || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, state: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CEP"
              value={selectedAddress?.zip_code || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, zip_code: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Complemento"
              value={selectedAddress?.complement || ''}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, complement: e.target.value })}
              fullWidth
              margin="normal"
            />
          </>
        </DialogContent>
        <DialogActions>
          <>
            <Button onClick={handleSaveAddress}>Salvar</Button>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          </>
        </DialogActions>
      </Dialog>
      <Dialog open={openModalPassword} onClose={() => setOpenModalPassword(false)}>
        <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
          Editar Senha
        </DialogTitle>
        <DialogContent sx={{ marginTop: 3 }}>
          <>
            <TextField
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
          </>
        </DialogContent>
        <DialogActions>
          <>
            <Button onClick={handleSavePassword}>Salvar</Button>
            <Button onClick={() => setOpenModalPassword(false)}>Cancelar</Button>
          </>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Profile;
