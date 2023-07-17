import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { localizedTextsMap } from '../../utils/localizedTextsMap';
import productService from '../../services/product/product-service';
import inventoryService from '../../services/inventory/inventory-service';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ThemeContext from '../style/ThemeContext';

const ProductsList = () => {
    const { theme } = useContext(ThemeContext);
    const [products, setProducts] = useState([]);
    const [openModalProduct, setOpenModalProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        productService.getAllProducts().then(response => {
            if (response.status === 200) {
                setProducts(response.data.products);
            }
        })
    }, [openModalProduct]);

    const columns = [
        { field: 'id_product', headerName: 'ID', width: 50 },
        { field: 'type', headerName: 'Nome', width: 150, editable: true },
        { field: 'purchase_price', headerName: 'Preço Compra', width: 150, editable: true },
        { field: 'sale_price', headerName: 'Preço Venda', width: 150, editable: true },
        { field: 'amount', headerName: 'Estoque', width: 100, editable: true, valueGetter: (params) => params.row.inventory.amount, },
        {
            field: 'edit',
            headerName: 'Editar',
            width: 70,
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditProduct(params.row)}
                >
                    <EditNoteIcon sx={{ color: 'green' }} />
                </Button>
            )
        }

    ];

    const handleEditProduct = (product) => {
        product.amount =  product?.inventory?.amount;
        
        setSelectedProduct(product);
        setOpenModalProduct(!openModalProduct);
    };



    const handleSaveProduct = () => {
        
        productService.updateProduct(selectedProduct).then(response => {
            if (response.status === 200) {
                inventoryService.updateInventory(selectedProduct?.inventory?.id_inventory, selectedProduct?.amount).then(response => {
                    if(response.status === 200){
                        toast.success('Produto atualizado com sucesso!');
                        setOpenModalProduct(false);

                    }
                }).catch(error => console.log(error));
            }
        }).catch(error => {
            console.log(error);
            toast.error('Não foi possível atualizar o produto.')
        });
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ToastContainer />
            <Typography color={  theme?.palette?.type === 'dark' ? 'green' : ''}>
                Produtos
            </Typography>
            <DataGrid
                sx={{ marginBottom: '160px', paddingBottom: '160px', color: theme?.palette?.type === 'dark' ? '#fff' : '' }}
                localeText={localizedTextsMap}
                rows={products}
                columns={columns}
                pageSize={5}
                componentsProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página",
                    }
                }}
                getRowId={(row) => row.id_product}
            />
            <Dialog open={openModalProduct} onClose={() => setOpenModalProduct(false)}>
                <DialogTitle fontWeight={800} textAlign="center" sx={{ backgroundColor: 'green', color: 'white' }}>
                    Editar Produto
                </DialogTitle>
                <DialogContent sx={{ marginTop: 3 }}>
                    <>
                        <TextField
                            label="Nome"
                            defaultValue={selectedProduct?.type || ''}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, type: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Preço Venda"
                            value={selectedProduct?.sale_price || ''}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, sale_price: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Preço Compra"
                            type='number'
                            value={selectedProduct?.purchase_price || ''}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, purchase_price: e.target.value })}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Estoque"
                            type='number'
                            defaultValue={selectedProduct?.amount || 0}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, amount: e.target.value })}
                            fullWidth
                            margin="normal"
                        />


                    </>

                </DialogContent>
                <DialogActions>

                    <>
                        <Button onClick={handleSaveProduct}>Salvar</Button>
                        <Button onClick={handleEditProduct}>Cancelar</Button>
                    </>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsList;
