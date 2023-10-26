import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box, CardMedia } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import emailService from '../../services/email/email-service';
import ThemeContext from '../style/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const WaitingApprovalList = () => {
    const { theme } = useContext(ThemeContext);
    const [collects, setCollects] = useState([]);
    const [selectedCollect, setSelectedCollect] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalApproval, setOpenModalApproval] = useState(false);
    const [openModalRefuse, setOpenModalRefuse] = useState(false);
    const [address, setAddress] = useState(false);
    const [processed, setProcessed] = useState(false);
    const [urlImage, setUrlImage] = useState(null);
    const reason = useRef(null);

    useEffect(() => {
        collectService.getCollectsByStatus('aguardando').then(response => {
            if (response.status === 200) {
                setCollects(response.data);
            }
        })
    }, [selectedCollect, processed,]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const handleAddress = (address) => {
        setAddress(address);
        setOpenModal(true);
    }

    const handleApproval = (collect) => {
        setSelectedCollect(collect);
        handleImage(collect.id);
        setOpenModalApproval(true);
        setAddress(collect)
    }

    const handleRefuse = (collect) => {
        setSelectedCollect(collect);
        setOpenModalRefuse(true);
    }

    const handleImage = (collect_id) => {
        collectService.getCollectImage(collect_id).then(response => {
            if (response.status === 200) {
                setUrlImage(response.data.imageUrl)
            }
        }).catch(error => console.log(error))
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
                const obj = {
                    "recipient": selectedCollect?.user?.email,
                    "user": selectedCollect?.user?.name,
                    "textMsg": "Boas notícias! Sua solicitação foi aprovada e no dia e horário agendado realizaremos a coleta. Obrigado por escolher a EcoGestor!",
                    "date": formatDate(selectedCollect.collect_date),
                    "schedule": selectedCollect.collect_time,
                    "address": selectedCollect.details_address
                }
                emailService.sendEmail(obj);
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
        if (!reason.current.value) {
            toast.warning('Por favor informe o motivo pela recusa da coleta');
        } else {
            collectService.refuse(selectedCollect.id, reason?.current?.value).then(response => {
                if (response.status === 200) {
                    const obj = {
                        "recipient": selectedCollect?.user?.email,
                        "user": selectedCollect?.user?.name,
                        "textMsg": `:( Sua solicitação não pôde ser atendida, lamentamos por isso. Motivo: ${reason?.current?.value}. Para mais informações, entre em contato conosco. Obrigado por escolher a EcoGestor!`,
                        "date": formatDate(selectedCollect.collect_date),
                        "schedule": selectedCollect.collect_time,
                        "address": selectedCollect.details_address
                    }
                    emailService.sendEmail(obj);
                    toast.success('Solicitação de coleta recusada com sucesso!');
                    setOpenModalApproval(false)
                    handleProcessed();
                    setOpenModalRefuse(false)
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
        { field: 'details', headerName: 'Detalhes', width: 150, editable: true,  renderCell: (params) => params.row.details || "Não se aplica" },
        {
            field: 'details_address', headerName: 'Endereço', width: 100, editable: true, renderCell: (params) => (
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
            field: 'to_approve', headerName: 'Analisar', width: 100, editable: true, renderCell: (params) => (
                <Button
                    color='success'
                    variant="outlined"
                    size="small"
                    onClick={() => handleApproval(params.row)}
                >
                    <ImageSearchIcon color='success' sx={{ color: 'green', backgrounds: 'green' }} />
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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
            <ToastContainer />
            <Typography color={theme?.palette?.type === 'dark' ? 'green' : ''}>
                Aguardando Aprovação
            </Typography>
            <DataGrid
                sx={{ marginBottom: '15vh', paddingBottom: '15vh', color: theme?.palette?.type === 'dark' ? '#fff' : '' }}
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
            <Dialog open={openModal} onClose={() => setOpenModal(false)} >
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: theme?.palette?.type === 'dark' ? 'black' : 'green', color: 'white' }}>
                    Endereço
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3, backgroundColor: theme?.palette?.type === 'dark' ? 'black' : '', color: theme?.palette?.type === 'dark' ? 'white' : '' }}>
                    <>
                        <FormatAddress address={address.details_address} />
                    </>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: theme?.palette?.type === 'dark' ? 'black' : '' }}>
                    <>
                        <Button onClick={() => setOpenModal(false)}><CloseIcon />Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>

            <Dialog open={openModalApproval} onClose={() => setOpenModalApproval(false)} fullWidth maxWidth="md" >
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Analisar Solicitação Coleta
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

                    <Typography mt={5}>Você deseja aprovar a solicitação de {selectedCollect?.user?.name}?</Typography>
                </DialogContent>

                <DialogActions>
                    <>

                        <Button variant='contained' color='success' onClick={() => handleApprovalCollect()} ><CheckCircleIcon sx={{ color: 'white' }} /><Typography ml={1}>Aprovar</Typography> </Button>
                        <Button variant='outlined' color='error' onClick={() => handleRefuse(selectedCollect)}><ThumbDownIcon sx={{ color: 'red' }} /><Typography ml={1}>Recusar</Typography> </Button>
                        <Button variant='outlined' onClick={() => setOpenModalApproval(false)}><CloseIcon />Fechar</Button>
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