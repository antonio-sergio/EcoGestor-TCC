import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import saleService from '../../services/sale/sale-service';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import moment from 'moment';
import { savePDF } from '@progress/kendo-react-pdf';

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [openModalSale, setOpenModalSale] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [items, setItems] = useState([]);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFileName, setExportFileName] = useState('');


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
        { field: 'createdAT', headerName: 'Data', width: 100, editable: true, valueGetter: (params) => formatDate(params.row.createdAt) },
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

    const selectedColumns = columns.filter((column) => {
        // Insira os nomes das colunas que deseja exportar
        return column.field === 'customer_id' || column.field === 'seller_id' || column.field === 'total';
      });

    const handleExportClick = () => {
        setExportDialogOpen(true);
    };
      


    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography>
                Vendas
            </Typography>
            <Box id="sales-table" height="60vh">
                <DataGrid
                    sx={{ marginBottom: '10px', paddingBottom: '10px' }}
                    localeText={localizedTextsMap}
                    rows={sales}
                    columns={columns}
                    pageSize={1}
                    componentsProps={{
                        pagination: {
                            labelRowsPerPage: "Linhas por página",
                        }
                    }}
                    getRowId={(row) => row.id_sale}
                />

            </Box>

            <Button onClick={handleExportClick}>Exportar para PDF</Button>

            <Dialog open={openModalSale} onClose={() => setOpenModalSale(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Detalhes da Venda
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TableContainer component={Paper} sx={{ marginBottom: "15px" }}>
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

            <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                <DialogTitle>Exportar para PDF</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome do arquivo"
                        value={exportFileName}
                        onChange={(e) => setExportFileName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={() => {
                            setExportDialogOpen(false);
                            const selectedData = sales.map((sale) => {
                                const selectedSale = {};
                                selectedColumns.forEach((column) => {
                                    selectedSale[column.field] = sale[column.field];
                                });
                                return selectedSale;
                            });
                            savePDF(document.getElementById('sales-table'), {
                                fileName: exportFileName || 'sales.pdf',
                                paperSize: 'A4',
                                margin: 30,
                                scale: 1,
                                repeatHeaders: true,
                                landscape: false,
                                exportOnlyData: false,
                                data: selectedData,
                                allPages: true,
                            });
                        }}
                        color="primary"
                    >
                        Exportar
                    </Button>

                </DialogActions>
            </Dialog>

        </div>
    );
};

export default SalesList;
