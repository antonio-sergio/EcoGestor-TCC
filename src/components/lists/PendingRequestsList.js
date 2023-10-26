import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box, CardMedia } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ThemeContext from '../style/ThemeContext';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CloseIcon from '@mui/icons-material/Close';



const PendingRequestsList = () => {
    const { theme } = useContext(ThemeContext);
    const [collects, setCollects] = useState([]);
    const [address, setAddress] = useState(false);
    const [openModalFinalize, setOpenModalFinalize] = useState(false);
    const [openModalCancel, setOpenModalCancel] = useState(false);
    const [selectedCollect, setSelectedCollect] = useState([]);
    const [processed, setProcessed] = useState(false);
    const [urlImage, setUrlImage] = useState(null);
    const [openModalShow, setOpenModalShow] = useState(false);

    const reasonCancel = useRef(null);


    useEffect(() => {
        collectService.getCollectsByStatus('pendente').then(response => {
            if (response.status === 200) {
                setCollects(response.data);
            }
        })
    }, [processed]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

   

    const handleProcessed = () => {
        if (processed === false) {
            setProcessed(true)
        } else {
            setProcessed(false)
        }
    }

    const handleImage = (collect_id) => {
        collectService.getCollectImage(collect_id).then(response => {
            if (response.status === 200) {
                setUrlImage(response.data.imageUrl)
            }
        }).catch(error => console.log(error))
    }

    const handleShow = (collect) => {
        setSelectedCollect(collect);
        handleImage(collect.id);
        setOpenModalShow(true);
        setAddress(collect)
    }
    const handlefinalizeCollect = (collect) => {
        setSelectedCollect(collect);
        setOpenModalFinalize(true);
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
        { field: 'details', headerName: 'Detalhes', width: 150, editable: true, renderCell: (params) => params.row.details || "Não se aplica" },
        {
            field: 'show', headerName: 'Infos', width: 100, editable: true, renderCell: (params) => (
                <Button
                    color='success'
                    variant="outlined"
                    size="small"
                    onClick={() => handleShow(params.row)}
                >
                    <ImageSearchIcon color='success' sx={{ color: 'green', backgrounds: 'green' }} />
                </Button>
            )
        },
        {
            field: 'finalize', headerName: 'Concluir Coleta', width: 100, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handlefinalizeCollect(params.row)}
                >
                    <CheckCircleIcon sx={{ color: 'green' }} />
                </Button>
            )
        },
        {
            field: 'cancel', headerName: 'Cancelar', width: 100, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleCancel(params.row)}
                >
                    <CancelIcon sx={{ color: 'red' }} />
                </Button>
            )
        },
    ];

    const FormatAddress = ({ address }) => {
        return (
            <Box>
                <Typography>{address}</Typography>
            </Box>
        )
    }

    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
            <ToastContainer />
            <Typography>
                Aprovadas, aguardando coleta
            </Typography>
            <DataGrid
                sx={{ marginBottom: '15vh', paddingBottom: '15vh', color: theme?.palette?.type === 'dark' ? '#fff' : '' }}
                localeText={localizedTextsMap}
                rows={collects}
                columns={columns}
                pageSize={10}
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página",
                    }
                }}
                getRowId={(row) => row.id}
            />
            
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
                    <Typography>Informe o motivo do cancelamento para a solicitação de {selectedCollect?.user?.name}:</Typography>
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

            <Dialog open={openModalShow} onClose={() => setOpenModalShow(false)} fullWidth maxWidth="md" >
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Dados Solicitação Coleta
                </DialogTitle>
                <DialogContent sx={{ marginTop: 4 }} >
                    <Box>
                        <Typography ><strong>Solicitante:</strong> {selectedCollect?.user?.name} </Typography>
                    </Box>
                    <Box>
                        <Typography ><strong>Contato:</strong> {selectedCollect?.user?.phone} </Typography>
                    </Box>
                    <Box>
                        <Typography fontWeight={600}>Endereço: </Typography>
                        <FormatAddress address={address.details_address} />
                    </Box>
                    <Box display="flex" width="100%" mt={2}>
                        <Box>
                            <Typography><strong>Data:</strong> {formatDate(selectedCollect.collect_date)}</Typography>
                            
                        </Box>
                        <Box ml={10}>
                            <Typography><strong>Hora:</strong> {selectedCollect.collect_time}</Typography>
                            
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <CardMedia component="img" alt='imagem do material a ser coletado' height={400} image={urlImage} sx={{objectFit: 'cover'}} />
                    </Box>

                </DialogContent>

                <DialogActions>
                    <>

                        <Button variant='outlined' onClick={() => setOpenModalShow(false)}><CloseIcon />Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default PendingRequestsList;