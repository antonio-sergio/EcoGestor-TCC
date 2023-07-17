import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CancelIcon from '@mui/icons-material/Cancel';
import AuthContext from '../../services/auth/AuthContext';


const MyCollectRequestList = () => {
    const { user } = useContext(AuthContext);
    const [collects, setCollects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [address, setAddress] = useState(false);
    const [openModalFinalize, setOpenModalFinalize] = useState(false);
    const [openModalCancel, setOpenModalCancel] = useState(false);
    const [selectedCollect, setSelectedCollect] = useState([]);
    const [processed, setProcessed] = useState(false);
    const reasonCancel = useRef(null);


    useEffect(() => {
        collectService.getCollectsByUser(user.id).then(response => {
            if (response.status === 200) {
                setCollects(response.data);
            }
        })
    }, [processed, user.id]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const handleAddress = (address) => {
        setAddress(address);
        setOpenModal(true);
    }

    const handleProcessed = () => {
        if (processed === false) {
            setProcessed(true)
        } else {
            setProcessed(false)
        }
    }

   

    const handleCancel = (collect) => {
        setSelectedCollect(collect);
        setOpenModalCancel(true);
    }

    const handleFinalizeCollect = () => {
        collectService.finalizeCollect(selectedCollect).then(response => {
            if (response.status === 200) {
                toast.success('Solicitação de coleta concluída com sucesso!');
                setOpenModalFinalize(false);
                handleProcessed();
            }
        }).catch(error => {
            console.log(error);
            toast.error('Não foi possível aprovar a solicitação de coleta.')
        })
    };

    const handleCancelCollect = () => {

        if (!reasonCancel.current.value) {
            toast.warning('Por favor informe o motivo do cancelamento da coleta');
        } else {
            collectService.refuse(selectedCollect.id, reasonCancel?.current?.value).then(response => {
                if (response.status === 200) {
                    toast.success('Solicitação de coleta cancelada com sucesso!');
                    setOpenModalCancel(false);
                    handleProcessed();

                }
            }).catch(error => {
                console.log(error);
                toast.error('Não foi possível cancelar a solicitação de coleta.')
            })
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
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
            field: 'details_address', headerName: 'Endereço', width: 200, align: "center", editable: false, renderCell: (params) => (
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
            field: 'cancel', headerName: 'Cancelar', width: 100,  editable: false, align: "center", renderCell: (params) => {
                if (params.row.status === 'aguardando' || params.row.status === 'pendente') {
                    return <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCancel(params.row)}
                    >
                        <CancelIcon sx={{ color: 'red' }} />
                    </Button>
                }
                return <Button
                    variant="outlined"
                    size="small"
                    disabled
                >
                    <CancelIcon sx={{ color: 'gray' }} />
                </Button>
            }
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
        <Box style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography mt={2} mb={2}>
                Minhas Solicitações de Coleta
            </Typography>
            <DataGrid
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
            <Dialog open={openModalFinalize} onClose={() => setOpenModalFinalize(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Concluir Coleta
                </DialogTitle>

                <DialogActions>
                    <>
                        <Button onClick={() => handleFinalizeCollect()}>Concluir Coleta</Button>
                        <Button onClick={() => setOpenModalFinalize(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
            <Dialog open={openModalCancel} onClose={() => setOpenModalCancel(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Cancelar Coleta
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <Typography>Por favor informe o motivo do cancelamento para a solicitação:</Typography>
                    <TextField
                        name="reasonCancel"
                        inputRef={reasonCancel}
                        required
                        fullWidth
                    ></TextField>
                </DialogContent>

                <DialogActions>
                    <>
                        <Button onClick={() => handleCancelCollect()} >Confirmar Cancelamento</Button>
                        <Button onClick={() => setOpenModalCancel(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </Box>

    );
};


export default MyCollectRequestList;