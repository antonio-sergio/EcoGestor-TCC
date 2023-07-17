import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    SpeedDial
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PrintIcon from '@mui/icons-material/Print';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import saleService from '../../services/sale/sale-service';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { toast, ToastContainer } from "react-toastify";
import ThemeContext from '../style/ThemeContext';


const SalesList = () => {
    const { theme } = useContext(ThemeContext);
    const [sales, setSales] = useState([]);
    const [openModalSale, setOpenModalSale] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const dataGridRef = useRef(null);

    useEffect(() => {
        saleService.getAllSale().then(response => {
            if (response.status === 200) {
                setSales(response.data.sales);
            }
        })
    }, [openModalSale, openModalDelete]);

    const columns = [
        { field: 'id_sale', headerName: 'ID', width: 50 },
        {
            field: 'customer_id',
            headerName: 'Cliente',
            width: 200,
            editable: true,
            valueGetter: (params) => params.row.customer?.name
        },
        {
            field: 'seller_id',
            headerName: 'Vendedor',
            width: 200,
            editable: true,
            valueGetter: (params) => params.row.seller?.name
        },
        { field: 'total', headerName: 'Total', width: 150, editable: true },
        {
            field: 'createdAT',
            headerName: 'Data',
            width: 100,
            editable: true,
            valueGetter: (params) => formatDate(params.row.createdAt)
        },
        {
            field: 'edit',
            headerName: 'Detalhar',
            width: 70,
            align: 'center',
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleShowSale(params.row)}>
                    <ContentPasteSearchIcon sx={{ color: 'green' }} />
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Deletar',
            width: 70,
            align: 'center',
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleDelete(params.row)}>
                    <DeleteIcon sx={{ color: 'red' }} />
                </Button>
            )
        }
    ];

    const handleShowSale = async (sale) => {
        setSelectedSale(sale);
        await saleService.getSaleItems(sale.id_sale).then((response) => {
            if (response.status === 200) {
                setItems(response.data);
            }
        });
        setOpenModalSale(!openModalSale);
    };

    const handleDelete = async (sale) => {
        setSelectedSale(sale);
        setOpenModalDelete(true);
    }

    const deleteSale = async () => {
        await saleService.delele(selectedSale.id_sale).then(response => {
            if(response.status === 200){
                toast.success('Venda deletada com sucesso!');
                setOpenModalDelete(false);
            }
        }).catch(error => {
            toast.error("Não foi possível deletar a venda!");
            console.log(error);
        })
    }

    const handleExportToExcel = () => {
        const selectedSaleIds = selectedRows.map((rowIndex) => rowIndex.id_sale);
        const selectedSales = sales.filter((sale) => selectedSaleIds.includes(sale.id_sale));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Vendas');

        columns.forEach((column, index) => {
            if (column.headerName !== 'Detalhar') {
                worksheet.getColumn(index + 1).header = column.headerName;
                worksheet.getColumn(index + 1).key = column.field;
                worksheet.getColumn(index + 1).width = 10;
            }
        });

        selectedSales.forEach((sale) => {
            const rowData = {};
            columns.forEach((column) => {
                if (column.field === 'customer_id' || column.field === 'seller_id') {
                    rowData[column.field] = column.valueGetter ? column.valueGetter({ row: sale }) : sale[column.field];
                } else if (column.field === 'total') {
                    rowData[column.field] = parseFloat(sale[column.field]).toFixed(2);
                } else if (column.field === 'createdAT') {
                    rowData[column.field] = formatDate(sale.createdAt);
                } else if (column.field === 'id_sale') {
                    rowData[column.field] = sale.id_sale;
                }
            });
            worksheet.addRow(rowData);
        });

        const saveOptions = {
            filename: 'vendas.xlsx',
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
        const printableData = selectedRows.map((sale) => ({
            ID: sale.id_sale,
            Cliente: sale.customer?.name,
            Vendedor: sale.seller?.name,
            Total: sale.total,
            Data: formatDate(sale.createdAt)
        }));

        const content = printableData
            .map((row) => `<tr><td>${row.ID}</td><td>${row.Cliente}</td><td>${row.Vendedor}</td><td>${row.Total}</td><td>${row.Data}</td></tr>`)
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
            <h2 class="header">Lista de Vendas</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Vendedor</th>
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
        const selectedRowsData = ids.map((id) => sales.find((row) => row.id_sale === id));
        setSelectedRows(selectedRowsData);
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
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

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography color={  theme?.palette?.type === 'dark' ? 'green' : ''}>
                Vendas
            </Typography>
            <Box id="sales-table" height="60vh">
                <DataGrid
                    ref={dataGridRef}
                    sx={{ marginBottom: '10px', paddingBottom: '10px', color: theme?.palette?.type === 'dark' ? '#fff' : ''  }}
                    localeText={localizedTextsMap}
                    rows={sales}
                    columns={columns}
                    pageSize={1}
                    componentsProps={{
                        pagination: {
                            labelRowsPerPage: 'Linhas por página'
                        }
                    }}
                    getRowId={(row) => row.id_sale}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                />
            </Box>

            <SpeedDialShared />

            <Dialog open={openModalSale} onClose={() => setOpenModalSale(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Detalhes da Venda
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TableContainer component={Paper} sx={{ marginBottom: '15px' }}>
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
                        <Typography>Data: {formatDate(selectedSale?.createdAt)}</Typography>
                        <Typography>Total: R$ {selectedSale?.total}</Typography>
                        <Typography>Comprador: {selectedSale?.customer?.name}</Typography>
                    </>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={() => setOpenModalSale(false)}>Fechar</Button>
                    </>
                </DialogActions>
            </Dialog>
            <Dialog open={openModalDelete} onClose={() => setOpenModalDelete(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Deletar Venda
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        
                         {selectedSale && `Deseja deletar a venda do cliente ${selectedSale?.customer?.name}`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={() => deleteSale()}>Confirmar</Button>
                        <Button onClick={() => setOpenModalDelete(false)}>Cancelar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SalesList;
