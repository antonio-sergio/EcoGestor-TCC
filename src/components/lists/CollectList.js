import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, SpeedDial, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import collectService from '../../services/collect/collect-service';
import moment from 'moment';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import PrintIcon from '@mui/icons-material/Print';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import ExcelJS from 'exceljs';


const CollectList = () => {
    const [collects, setCollects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [details, setDetails] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const dataGridRef = useRef(null);

    useEffect(() => {
        collectService.getAllCollects().then(response => {
            if (response.status === 200) {
                setCollects(response.data.collects);
            }
        })
    }, []);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const handleDetails = (details) => {
        setDetails(details);
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
        { field: 'details_address', headerName: 'Endereço', width: 600, editable: true },
        {
            field: 'details', headerName: 'Observação', width: 200, editable: true, renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDetails(params.row)}
                >
                    <ContentPasteSearchIcon />
                </Button>
            )
        },
    ];

    const handleExportToExcel = () => {
        const selectedCollectIds = selectedRows.map((rowIndex) => rowIndex.id);
        const selectedCollects = collects.filter((collect) => selectedCollectIds.includes(collect.id));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Coletas');

        columns.forEach((column, index) => {
            if (column.headerName !== 'Observação') {
                worksheet.getColumn(index + 1).header = column.headerName;
                worksheet.getColumn(index + 1).key = column.field;
                worksheet.getColumn(index + 1).width = 10;
            }
        });

        selectedCollects.forEach((collect) => {
            const rowData = {};
            columns.forEach((column) => {
                if (column.field === 'id') {
                    rowData[column.field] = collect.id;
                } else if (column.field === 'user_id' || column.field === 'phone') {
                    rowData[column.field] = column.valueGetter ? column.valueGetter({ row: collect }) : collect[column.field];
                } else if (column.field === 'collect_date') {
                    rowData[column.field] = formatDate(collect.createdAt);
                } else if (column.field === 'collect_time') {
                    rowData[column.field] = collect.collect_time;
                } else if (column.field === 'status') {
                    rowData[column.field] = collect.status;
                } else if (column.field === 'details_address') {
                    rowData[column.field] = collect.details_address;
                } else if (column.field === 'final_date') {
                    rowData[column.field] = formatDate(collect.final_date);
                }
            });
            worksheet.addRow(rowData);
        });

        const saveOptions = {
            filename: 'coletas.xlsx',
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
        const printableData = selectedRows.map((collect) => ({
            ID: collect.id,
            Solicitante: collect.user?.name,
            Telefone: collect.user?.phone,
            Data: formatDate(collect.collect_date),
            Hora: collect.collect_time,
            Status: collect.status,
            DataColeta:  formatDate(collect.final_date),
            Endereco: collect.details_address
        }));

        const content = printableData
            .map((row) => `<tr>
            <td>${row.ID}</td>
            <td>${row.Solicitante}</td>
            <td>${row.Telefone}</td>
            <td>${row.Data}</td>
            <td>${row.Status}</td>
            <td>${row.DataColeta}</td>
            <td>${row.Endereco}</td>
            </tr>`)
            .join('');

        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <style>
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
            <h2 class="header">Lista de Coletas</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Solicitante</th>
                  <th>Telefone</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Data Coleta</th>
                  <th>Endereço</th>
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
        const selectedRowsData = ids.map((id) => collects.find((row) => row.id === id));
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

    return (
        <div style={{ height: '80vh', width: '100%', maxWidth: "90vw" }}>
            <ToastContainer />
            <Typography>
                Solicitações de Coleta
            </Typography>
            <Box id="collects-table" height="60vh">

            <DataGrid
                ref={dataGridRef}
                sx={{ marginBottom: '10px', paddingBottom: '10px' }}
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
                checkboxSelection
                onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            />
            </Box>

            <SpeedDialShared />

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Observação
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        {details?.details || "Nenhuma observação foi adicionada"}
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


export default CollectList;