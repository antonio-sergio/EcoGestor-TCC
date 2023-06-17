import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import purchaseService from '../../services/purchase/purchase-service';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import moment from 'moment';

const PurchasesList = () => {
    const [purchases, setPurchases] = useState([]);
    const [openModalPurchase, setOpenModalPurchase] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        purchaseService.getAllPurchase().then(response => {
            console.log('reponse purchase', response.data.purchases)
            if (response.status === 200) {
                setPurchases(response.data.purchases);
            }
        })
    }, [openModalPurchase]);

    const columns = [
        { field: 'id_purchase', headerName: 'ID', width: 50 },
        { field: 'customer_id', headerName: 'Cliente', width: 200, editable: true, valueGetter: (params) => params.row.customer.name },
        { field: 'seller_id', headerName: 'Vendedor', width: 200, editable: true, valueGetter: (params) => params.row.seller.name },
        { field: 'total', headerName: 'Total', width: 150, editable: true },
        { field: 'createdAT', headerName: 'Data', width: 100, editable: true, valueGetter: (params) => formatDate(params.row.createdAt)},
        {
            field: 'edit',
            headerName: 'Detalhar',
            width: 70,
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleShowPurchase(params.row)}
                >
                    <ContentPasteSearchIcon sx={{ color: 'green' }} />
                </Button>
            )
        }

    ];

    const handleShowPurchase = async (purchase) => {
        setSelectedPurchase(purchase);
        console.log('selectedpurc', selectedPurchase)
        await purchaseService.getPurchaseItems(purchase.id_purchase).then(response => {
            if (response.status === 200) {
                setItems(response.data)
            }
        })
        console.log('items', items)
        setOpenModalPurchase(!openModalPurchase);
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <DataGrid
                localeText={localizedTextsMap}
                rows={purchases}
                columns={columns}
                pageSize={5}
                autoHeight
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página",
                    }
                }}
                getRowId={(row) => row.id_purchase}
            />
            <Dialog  open={openModalPurchase} onClose={() => setOpenModalPurchase(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Detalhes da Compra
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TableContainer component={Paper} sx={{marginBottom: "15px"}}>
                            <Table aria-label="Purchase Items Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Produto</TableCell>
                                        <TableCell>Preço Item</TableCell>
                                        <TableCell>Qtd</TableCell>
                                        <TableCell>Total Item</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id_purchase_item}>
                                            <TableCell>{item.id_purchase_item}</TableCell>
                                            <TableCell>{item.product_name}</TableCell>
                                            <TableCell>{item.item_price}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>{item.item_total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>


                            </Table>
                        </TableContainer>
                        <Typography>
                            Data: {formatDate(selectedPurchase?.createdAt)}
                        </Typography>
                        <Typography>
                            Total: R$ {selectedPurchase?.total}
                        </Typography>
                        <Typography>
                            Vendedor: {selectedPurchase?.seller?.name}
                        </Typography>
                    </>

                </DialogContent>
                <DialogActions>

                    <>
                        <Button onClick={() => setOpenModalPurchase(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PurchasesList;
