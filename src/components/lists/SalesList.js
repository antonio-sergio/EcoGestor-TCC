import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import saleService from '../../services/sale/sale-service';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import moment from 'moment';

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [openModalSale, setOpenModalSale] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        saleService.getAllSale().then(response => {
            if (response.status === 200) {
                setSales(response.data.sales);
            }
        })
    }, [openModalSale]);

    const columns = [
        { field: 'id_sale', headerName: 'ID', width: 50 },
        { field: 'customer_id', headerName: 'Cliente', width: 200, editable: true, valueGetter: (params) => params.row.customer?.name },
        { field: 'seller_id', headerName: 'Vendedor', width: 200, editable: true, valueGetter: (params) => params.row.seller?.name },
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
                    onClick={() => handleShowSale(params.row)}
                >
                    <ContentPasteSearchIcon sx={{ color: 'green' }} />
                </Button>
            )
        }

    ];

    const handleShowSale = async (sale) => {
        setSelectedSale(sale);
        await saleService.getSaleItems(sale.id_sale).then(response => {
            if (response.status === 200) {
                setItems(response.data)
            }
        })
        setOpenModalSale(!openModalSale);
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <DataGrid
                localeText={localizedTextsMap}
                rows={sales}
                columns={columns}
                pageSize={5}
                autoHeight
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página",
                    }
                }}
                getRowId={(row) => row.id_sale}
            />
            <Dialog  open={openModalSale} onClose={() => setOpenModalSale(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Detalhes da Venda
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TableContainer component={Paper} sx={{marginBottom: "15px"}}>
                            <Table aria-label="Sale Items Table">
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
                                        <TableRow key={item.id_sale_item}>
                                            <TableCell>{item.id_sale_item}</TableCell>
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
                            Data: {formatDate(selectedSale?.createdAt)}
                        </Typography>
                        <Typography>
                            Total: R$ {selectedSale?.total}
                        </Typography>
                        <Typography>
                            Comprador: {selectedSale?.customer?.name}
                        </Typography>
                    </>

                </DialogContent>
                <DialogActions>

                    <>
                        <Button onClick={() => setOpenModalSale(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SalesList;
