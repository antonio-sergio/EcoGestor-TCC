import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';


const CompletedList = () => {
    const [collects, setCollects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [address, setAddress] = useState(false);

    useEffect(() => {
        collectService.getCollectsByStatus('finalizado').then(response => {
            if (response.status === 200) {
                setCollects(response.data);
            }
        })
    }, []);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const handleAddress = (address) => {
        setAddress(address);
        setOpenModal(true);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Solicitante', width: 100, editable: true, valueGetter: (params) => params.row.user.name },
        { field: 'phone', headerName: 'Telefone', width: 100, editable: true, valueGetter: (params) => params.row.user.phone },
        { field: 'collect_date', headerName: 'Data', width: 100, editable: true, valueGetter: (params) => formatDate(params.row.collect_date) },
        { field: 'collect_time', headerName: 'Hora', width: 100, editable: true },
        { field: 'status', headerName: 'Status', width: 150, editable: true },
        {
            field: 'final_date', headerName: 'Data de Coleta', width: 200, editable: true, valueGetter: (params) => {
                if (params.row.final_date !== null) {
                    return formatDate(params.row.final_date)
                } else {
                    return "Coleta não realizada"
                }
            }
        },
        { field: 'details', headerName: 'Detalhes', width: 150, editable: true },
        {
            field: 'details_address', headerName: 'Endereço', width: 200, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddress(params.row)}
                >
                    <ContentPasteSearchIcon />
                </Button>
            )
        },
    ];

    const FormatAddress = ({ address }) => {
        let array = String(address).split('; ');
        return (
            <Box>
                <Typography>Logradouro: <strong>{array[0]}</strong></Typography>
                <Typography>Nº: <strong>{array[1]}</strong></Typography>
                <Typography>Bairro: <strong>{array[2]}</strong></Typography>
                <Typography>Cidade: <strong>{array[3]}</strong></Typography>
                <Typography>Estado: <strong>{array[4]}</strong></Typography>
                <Typography>Complemento: <strong>{array[5]}</strong></Typography>
                <Typography>CEP: <strong>{array[6]}</strong></Typography>
            </Box>
        )
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography>
                Coletas Realizadas
            </Typography>
            <DataGrid
                sx={{ marginBottom: '160px', paddingBottom: '160px' }}
                localeText={localizedTextsMap}
                rows={collects}
                columns={columns}
                pageSize={5}
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página",
                    }
                }}
                getRowId={(row) => row.id}
            />
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Endereço
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <FormatAddress address={address.details_address} />
                    </>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={() => setOpenModal(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>

    );
};


export default CompletedList;