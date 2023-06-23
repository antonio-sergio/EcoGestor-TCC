import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const WaitingApprovalList = () => {
    const [collects, setCollects] = useState([]);
    const [selectedCollect, setSelectedCollect] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalApproval, setOpenModalApproval] = useState(false);
    const [openModalRefuse, setOpenModalRefuse] = useState(false);
    const [address, setAddress] = useState(false);
    const [processed, setProcessed] = useState(false);
    const reason = useRef(null);

    useEffect(() => {
        collectService.getCollectsByStatus('aguardando').then(response => {
            if (response.status === 200) {
                setCollects(response.data);
            }
        })
    }, [selectedCollect, processed]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const handleAddress = (address) => {
        setAddress(address);
        setOpenModal(true);
    }

    const handleApproval = (collect) => {
        setSelectedCollect(collect);
        setOpenModalApproval(true);
    }

    const handleRefuse = (collect) => {
        setSelectedCollect(collect);
        setOpenModalRefuse(true);
    }

  

    const handleProcessed = () => {
        if (processed === false) {
            setProcessed(true)
        } else {
            setProcessed(false)
        }
    }

    const handleApprovalCollect = () => {
        collectService.approval(selectedCollect.id).then(response => {
            if (response.status === 200) {
                toast.success('Solicitação de coleta aprovada com sucesso!');
                setOpenModalApproval(false);
                handleProcessed();
            }
        }).catch(error => {
            console.log(error);
            toast.error('Não foi possível aprovar a solicitação de coleta.')
        })
    };

    const handleRefuseCollect = () => {
        console.log('reaon ref', reason.current.value)

        if (!reason.current.value) {
            toast.warning('Por favor informe o motivo pela recusa da coleta');
        } else {
            collectService.refuse(selectedCollect.id, reason?.current?.value).then(response => {
                if (response.status === 200) {
                    toast.success('Solicitação de coleta recusada com sucesso!');
                    setOpenModalRefuse(false);
                    handleProcessed();

                }
            }).catch(error => {
                console.log(error);
                toast.error('Não foi possível recusar a solicitação de coleta.')
            })
        }
    };




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
        {
            field: 'to_approve', headerName: 'Aprovar', width: 200, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleApproval(params.row)}
                >
                    <CheckCircleIcon sx={{ color: 'green', backgrounds: 'green' }} />
                </Button>
            )
        },
        {
            field: 'refuse', headerName: 'Recusar', width: 200, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRefuse(params.row)}
                >
                    <ThumbDownIcon sx={{ color: 'red' }} />
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
                Aguardando Aprovação
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

            <Dialog open={openModalApproval} onClose={() => setOpenModalApproval(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Aprovar Coleta
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <Typography>Você deseja aprovar a solicitação de {selectedCollect?.user?.name}?</Typography>
                </DialogContent>

                <DialogActions>
                    <>
                        <Button onClick={() => handleApprovalCollect()} >Confirmar Aprovação</Button>
                        <Button onClick={() => setOpenModalApproval(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>

            <Dialog open={openModalRefuse} onClose={() => setOpenModalRefuse(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Recusar Coleta
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <Typography>Informe o motivo da recusa para a solicitação de {selectedCollect?.user?.name}:</Typography>
                    <TextField
                        name="reason"
                        inputRef={reason}
                        required
                        fullWidth
                    ></TextField>
                </DialogContent>

                <DialogActions>
                    <>
                        <Button onClick={() => handleRefuseCollect()} >Confirmar Recusa</Button>
                        <Button onClick={() => setOpenModalRefuse(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>

            
        </div>

    );
};


export default WaitingApprovalList;