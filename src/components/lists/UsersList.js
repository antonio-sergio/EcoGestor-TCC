import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import userService from '../../services/user/user-service';
import addressService from '../../services/address/address-service';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ThemeContext from '../style/ThemeContext';


const UsersList = () => {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    userService.getAllUsers().then(response => {
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    })
  }, [openModalUser]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Nome', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 300, editable: true },
    { field: 'phone', headerName: 'Contato', width: 150, editable: true },
    {
      field: 'role',
      headerName: 'Acesso',
      width: 130,
      renderCell: (params) => {
        const { value } = params;
        if (value === 'admin') {
          return "Administrador";
        } else {
          return "Usuário";
        }
      },
    },
    {
      field: 'type',
      headerName:
        'Função',
      width: 100,
      renderCell: (params) => {
        const { value } = params;
        if (value === 'seller') {
          return "Vendedor";
        } else {
          return "Comprador";
        }
      },
    },
    {
      field: 'address_id',
      headerName: 'Endereço',
      width: 75,
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleShowAddress(params.value)}
        >
          <PersonPinCircleIcon sx={{ color: 'green' }} />
        </Button>
      )
    },
    {
      field: 'edit',
      headerName: 'Editar',
      width: 70,
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditUser(params.row)}
        >
          <EditNoteIcon sx={{ color: 'green' }} />
        </Button>
      )
    }
  ];

  const handleShowAddress = (addressId) => {
    addressService.getOneAddress(addressId).then(response => {
      if (response.status === 200) {
        setSelectedAddress(response.data);
        setOpenModal(true);
      }
    });
  };

  const handleEditAddress = () => {
    setEditMode(!editMode);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenModalUser(!openModalUser);
  };

  const handleSaveAddress = () => {
    addressService.updateAddress(selectedAddress).then(response => {
      if (response.status === 200) {
        toast.success('Endereço atualizado com sucesso!');
        setEditMode(!editMode);

      }
    }).catch(error => {
      console.log(error);
      toast.error('Não foi possível atualizar o endereço.')
    })
  };

  const handleSaveUser = () => {
    userService.updateUser(selectedUser).then(response => {
      if (response.status === 200) {
        toast.success('Usuário atualizado com sucesso!');
        setOpenModalUser(false);

      }
    }).catch(error => {
      console.log(error);
      toast.error('Não foi possível atualizar o usuário.')
    });
  };



  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ToastContainer />
      <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''}>
        Usuários
      </Typography>
      <Box height="60vh">
        <DataGrid
          sx={{ color: theme?.palette?.type === 'dark' ? '#fff' : '' }}
          localeText={localizedTextsMap}
          rows={users}
          columns={columns}
          pageSize={5}
          componentsProps={{
            pagination: {
              labelRowsPerPage: "Linhas por página",
            }
          }}
        />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
          {editMode ? 'Editar Endereço' : 'Dados do Endereço'}
        </DialogTitle>
        <DialogContent sx={{ marginTop: 3 }}>
          {editMode ? (
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
          ) : (
            selectedAddress && (
              <>
                <Typography variant="body1"><strong>Logradouro:</strong> {selectedAddress.street}</Typography>
                <Typography variant="body1"><strong>Número:</strong> {selectedAddress.number}</Typography>
                <Typography variant="body1"><strong>Bairro:</strong> {selectedAddress.neighborhood}</Typography>
                <Typography variant="body1"><strong>Cidade:</strong> {selectedAddress.city}</Typography>
                <Typography variant="body1"><strong>Estado:</strong> {selectedAddress.state}</Typography>
                <Typography variant="body1"><strong>CEP:</strong> {selectedAddress.zip_code}</Typography>
                {selectedAddress?.complement && <Typography variant="body1"><strong>Complemento:</strong> {selectedAddress.complement}</Typography>}
              </>
            )
          )}
        </DialogContent>
        <DialogActions>
          {!editMode ? (
            <>
              <Button onClick={handleEditAddress}>Editar</Button>
              <Button onClick={() => setOpenModal(false)}>Fechar</Button>
            </>
          ) : (
            <>
              <Button onClick={handleSaveAddress}>Salvar</Button>
              <Button onClick={handleEditAddress}>Cancelar</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={openModalUser} onClose={() => setOpenModalUser(false)}>
        <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
          Editar Usuário
        </DialogTitle>
        <DialogContent sx={{ marginTop: 3 }}>
          <>
            <TextField
              label="Nome"
              defaultValue={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contato"
              value={selectedUser?.phone || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="acesso-label">Acesso</InputLabel>
              <Select
                label="Acesso"
                labelId="acesso-label"
                value={selectedUser?.role || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <MenuItem value="user">Usuário</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Função</InputLabel>
              <Select
                label="Função"
                labelId="type-label"
                value={selectedUser?.type || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, type: e.target.value })}
              >
                <MenuItem value="seller">Vendedor</MenuItem>
                <MenuItem value="customer">Comprador</MenuItem>
              </Select>
            </FormControl>

          </>

        </DialogContent>
        <DialogActions>

          <>
            <Button onClick={handleSaveUser}>Salvar</Button>
            <Button onClick={handleEditUser}>Cancelar</Button>
          </>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersList;
