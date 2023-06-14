import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

import { localizedTextsMap } from '../../utils/localizedTextsMap';
import userService from '../../services/user/user-service';
import addressService from '../../services/address/address-service';


const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);


  useEffect(() => {
    userService.getAllUsers().then(response => {
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    })
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Nome', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 300, editable: true },
    { field: 'phone', headerName: 'Contato', width: 150, editable: true },
    { field: 'role', headerName: 'Acesso', width: 100 },
    { field: 'type', headerName: 'Função', width: 100 },
    {
      field: 'address_id',
      headerName: 'Endereço',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleShowAddress(params.value)}
        >
          Ver Endereço
        </Button>
      )
    },

  ];

  const handleShowAddress = (addressId) => {
    addressService.getOneAddress(addressId).then(response => {
      if (response.status === 200) {
        setSelectedAddress(response.data);
        console.log('datdos response addres', response.data)
        setOpenModal(true);
      }
    });
  };



  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid

        localeText={localizedTextsMap}
        rows={users}
        columns={columns}
        pageSize={5}
        autoHeight
        componentsProps={{
          pagination: {
            labelRowsPerPage: "Linhas por página",
          }
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'primary' : 'odd'
        }
      />
      <Dialog open={openModal} onClose={() => setOpenModal(false)} >
        <DialogTitle fontWeight={800} textAlign="center" sx={{backgroundColor: 'green', color: 'white'}}>Dados do Endereço</DialogTitle>
        <DialogContent sx={{marginTop: 3}}>
          {/* Renderize os dados do endereço dentro deste componente */}
          {selectedAddress && (
            <>
              <Typography variant="body1"><strong>Logradouro:</strong> {selectedAddress.street}</Typography>
              <Typography variant="body1"><strong>Número:</strong> {selectedAddress.number}</Typography>
              <Typography variant="body1"><strong>Bairro:</strong> {selectedAddress.neighborhood}</Typography>
              <Typography variant="body1"><strong>Cidade:</strong> {selectedAddress.city}</Typography>
              <Typography variant="body1"><strong>Estado:</strong> {selectedAddress.state}</Typography>
              <Typography variant="body1"><strong>CEP:</strong> {selectedAddress.zip_code}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersList;
