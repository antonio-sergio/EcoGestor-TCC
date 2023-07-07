import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, SpeedDial,  Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import purchaseService from '../../services/purchase/purchase-service';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PrintIcon from '@mui/icons-material/Print';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import ExcelJS from 'exceljs';

import moment from 'moment';

const PurchasesList = () => {
    const [purchases, setPurchases] = useState([]);
    const [openModalPurchase, setOpenModalPurchase] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const dataGridRef = useRef(null);

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
        { field: 'seller_id', headerName: 'Fornecedor', width: 200, editable: true, valueGetter: (params) => params.row.seller.name },
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

    const handleExportToExcel = () => {
        const selectedPurchasesIds = selectedRows.map((rowIndex) => rowIndex.id_purchase);
        const selectedPurchase = purchases.filter((purchase) => selectedPurchasesIds.includes(purchase.id_purchase));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Compras');

        columns.forEach((column, index) => {
            if(column.headerName !== 'Detalhar'){
                worksheet.getColumn(index + 1).header = column.headerName ;
                worksheet.getColumn(index + 1).key = column.field;
                worksheet.getColumn(index + 1).width = 10;
            }
        });

        selectedPurchase.forEach((purchase) => {
            const rowData = {};
            columns.forEach((column) => {
                if (column.field === 'customer_id' || column.field === 'seller_id') {
                    rowData[column.field] = column.valueGetter ? column.valueGetter({ row: purchase }) : purchase[column.field];
                } else if (column.field === 'total') {
                    rowData[column.field] = parseFloat(purchase[column.field]).toFixed(2);
                } else if (column.field === 'createdAT') {
                    rowData[column.field] = formatDate(purchase.createdAt);
                } else if (column.field === 'id_purchase') {
                    rowData[column.field] = purchase.id_purchase;
                }
            });
            worksheet.addRow(rowData);
        });

        const saveOptions = {
            filename: 'compras.xlsx',
            useStyles: true,
            useSharedStrings: true
        };

        workbook.xlsx.writeBuffer().then((buffer) => {
            const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = saveOptions.filename;
            link.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        });
    };

    const handlePrint = () => {
        const printableData = selectedRows.map((purchase) => ({
            ID: purchase.id_purchase,
            Cliente: purchase.customer?.name,
            Fornecedor: purchase.seller?.name,
            Total: purchase.total,
            Data: formatDate(purchase.createdAt)
        }));

        const content = printableData
            .map((row) => `<tr><td>${row.ID}</td><td>${row.Cliente}</td><td>${row.Fornecedor}</td><td>${row.Total}</td><td>${row.Data}</td></tr>`)
            .join('');

        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <style>
              /* Estilos personalizados para a página de impressão */
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  margin: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid #ccc;
                  padding: 8px;
                  text-align: left;
                }
                thead {
                  display: table-header-group;
                }
                tr {
                  page-break-inside: avoid;
                }
              }
              .header {
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <h2 class="header">Lista de Compras</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fornecedor</th>
                  <th>Total</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                ${content}
              </tbody>
            </table>
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
    };

    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => purchases.find((row) => row.id_purchase === id));
        setSelectedRows(selectedRowsData);
    };

    const actions = [
        { icon: <ShareIcon />, name: 'Exportar Excel' },
        { icon: <PrintIcon />, name: 'Imprimir' },
    ];

    const handleActionClick = (actionName) => {
        switch (actionName) {
            case 'Exportar Excel':
                handleExportToExcel();
                break;
            case 'Imprimir':
                handlePrint();
                break;
            default:
                break;
        }
    };

    const SpeedDialShared = () => {
        return (
            <Box sx={{ height: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>
                <SpeedDial
                    ariaLabel="SpeedDial"
                    sx={{ position: 'absolute', bottom: 16, right: 16, }}
                    icon={<SpeedDialIcon />}
                    FabProps={{
                        sx: {
                            bgcolor: 'success.main',
                            '&:hover': {
                                bgcolor: 'success.main',
                            }
                        }
                    }}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => handleActionClick(action.name)}
                        />
                    ))}
                </SpeedDial>
            </Box>
        )
    }


    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography>
                Compras
            </Typography>
            <Box id="purchases-table" height="60vh">

                <DataGrid
                    ref={dataGridRef}
                    sx={{ marginBottom: '10px', paddingBottom: '10px' }}
                    localeText={localizedTextsMap}
                    rows={purchases}
                    columns={columns}
                    pageSize={5}
                    componentsProps={{
                        pagination: {
                            labelRowsPerPage: "Linhas por página",
                        }
                    }}
                    getRowId={(row) => row.id_purchase}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                />
            </Box>
            <SpeedDialShared />
            <Dialog open={openModalPurchase} onClose={() => setOpenModalPurchase(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Detalhes da Compra
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TableContainer component={Paper} sx={{ marginBottom: "15px" }}>
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
                            Fornecedor: {selectedPurchase?.seller?.name}
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
