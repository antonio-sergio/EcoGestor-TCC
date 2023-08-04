import React, { useEffect, useState, useContext } from 'react';
import productService from "../services/product/product-service";
import saleService from "../services/sale/sale-service";
import userService from "../services/user/user-service";
import { TextField, Box, Grid, Typography, FormControl, InputLabel, MenuItem, Select, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../services/auth/AuthContext';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThemeContext from '../components/style/ThemeContext';


const Sales = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [sale, setSale] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [amount, setAmount] = useState(0);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        userService.getCustomers()
            .then(response => {
                if (response.status === 200) {
                    setCustomers(response.data);
                }
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        productService.getAllProducts()
            .then(response => {
                if (response.status === 200) {
                    setProducts(response.data.products);
                }
            })
            .catch(error => console.log(error));
    }, [items, sale]);

    const calculateSubtotal = (item) => {
        return item.amount * item.sale_price;
    };

    const handleAddItem = () => {
        if (selectedProduct === 0 || amount < 1) {
            toast.warning('Por favor selecione o produto e insira uma quantidade válida!')
        } else {
            const selectedProductInventory = selectedProduct?.inventory?.amount;

            if (amount < 1 || amount > selectedProductInventory) {
                toast.warning("Não pode ser adicionada uma quantidade maior que o estoque atual!")
                return; // Não adiciona o item se a quantidade for menor que 1 ou maior que o estoque disponível
            }

            const existingItemIndex = items.findIndex(item => item.product_id === selectedProduct.id_product);

            if (existingItemIndex !== -1) {
                const updatedItems = [...items];
                const updatedAmount = updatedItems[existingItemIndex].amount + parseInt(amount);

                if (updatedAmount > selectedProductInventory) {
                    return; // Não atualiza o item se a quantidade total ultrapassar o estoque disponível
                }

                updatedItems[existingItemIndex].amount = updatedAmount;
                updatedItems[existingItemIndex].subtotal = calculateSubtotal(updatedItems[existingItemIndex]);
                setItems(updatedItems);
            } else {
                const newItem = {
                    product_id: selectedProduct.id_product,
                    amount: parseInt(amount),
                    product_name: selectedProduct.type,
                    sale_price: selectedProduct.sale_price,
                    subtotal: calculateSubtotal({
                        amount: parseInt(amount),
                        sale_price: selectedProduct.sale_price
                    })
                };
                setItems([...items, newItem]);
            }

            setSelectedProduct(0);
            setAmount(0);
        }
    };

    const handleRemoveItem = (index) => {
        setItems(prevItems => prevItems.filter((item, i) => i !== index));
    };

    useEffect(() => {
        // Recalcula o total quando a lista de itens é alterada
        const calculateTotal = () => {
            let sum = 0;
            items.forEach(item => {
                sum += item.subtotal;
            });
            setTotal(sum);
        };
        calculateTotal();
    }, [items]);

    const currentDateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const currentDate = new Date().toLocaleDateString(undefined, currentDateOptions);

    const createSale = () => {
        if (selectedCustomer === null) {
            toast.warning('Por favor selecione o cliente!');
        } else if (items.length === 0) {
            toast.warning('Por favor adicione pelo menos 1 item antes de finalizar a venda!');
        } else {
            const sale = {
                customer_id: selectedCustomer.id_user,
                seller_id: user.id,
                saleItems: items
            }
            saleService.create(sale).then(response => {
                if (response.status === 201) {
                    toast.success('Venda efetuada com sucesso!');
                    if (!sale) {
                        setSale(false);
                    } else {
                        setSale(true);
                    }
                }
            }).catch(error => {
                toast.error(`Não foi possível efetuar a venda. ${error.response.data.message}`)
            })
            setItems([]);
            setSelectedProduct(0);
            setSelectedCustomer(null);
        }
    }

    console.log('tema', theme)
    return (
        <Grid container spacing={14} display="flex" justifyContent="center" alignItems="center"  height="100%">
            <ToastContainer />
            <Grid item xs={12}>
                <Box component={Paper} display="flex" sx={{ backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "", color: theme?.palette?.type === 'dark' ? 'green' : 'black' }} elevation={4} p={3}>
                    <Typography variant="subtitle1">Operação: <strong>VENDA</strong></Typography>
                    <Typography sx={{marginLeft: 5}} variant="subtitle1">Data: <strong>{currentDate}</strong></Typography>
                </Box>
            </Grid>
            <Grid item xs={12} display="flex" alignItems="center" pr={5}>
                <Grid item xs={12} display="flex" justifyContent="center">
                    <Grid item xs={12} sm={9} >
                        <Box component={Paper} elevation={2} m={5} p={3} height="450px" position="relative" sx={{ backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "", color: theme?.palette?.type === 'dark' ? 'green' : 'black',   border: theme?.palette?.type === 'dark' ? 'green 1px solid' : "" }}>
                            <Typography variant="h6">Lista de items</Typography>
                            {items.length === 0 ? (
                                <Box sx={{ height: "80%", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px" }}>
                                    <Typography variant="body2" fontSize={24}>Nenhum item adicionado</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ maxHeight: "360px", overflowY: "auto"  }}>
                                    <TableContainer>
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{color: 'green'}}>Código</TableCell>
                                                    <TableCell sx={{color: 'green'}}>Produto</TableCell>
                                                    <TableCell sx={{color: 'green'}}>Quantidade</TableCell>
                                                    <TableCell sx={{color: 'green'}}>Subtotal</TableCell>
                                                    <TableCell sx={{color: 'green'}}>Remover</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody >
                                                {items.map((item, index) => (
                                                    <TableRow   key={index}>
                                                        <TableCell>
                                                            <Typography sx={{color: 'green'}}>
                                                                <strong >{item.product_id}</strong>
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography sx={{color: 'green'}}>
                                                                {String(item.product_name).toUpperCase()}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography sx={{color: 'green'}}>
                                                                <strong>{item.amount} Un.</strong>
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography sx={{color: 'green'}}><strong>R$ {item.subtotal}</strong></Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => handleRemoveItem(index)}>
                                                                <RemoveCircleIcon color="error" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                            <Grid item xs={12} display="flex" mt={2} justifyContent="space-between" position="absolute" bottom={4} left={4} right={4}>
                                {total > 0 && <Typography fontSize={28} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Total R$: <strong style={{ paddingLeft: "10px" }}>{total}</strong></Typography>}
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={items.length === 0}
                                    onClick={createSale}
                                >
                                    Finalizar Venda
                                </Button>
                            </Grid>
                        </Box>

                    </Grid>
                </Grid>

                <Grid component={Paper} item xs={9} py={2} my={5} sm={3} display="flex" minWidth="400px" justifyContent="center" flexDirection="column" alignItems="center" sx={{ backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "", color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>
                    <Grid item xs={12} sm={9} height="450px" >
                        <FormControl fullWidth margin="normal">
                            <InputLabel color='success' sx={{ width: '100%', color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>Cliente</InputLabel>
                            <Select
                                labelId="customer-label"
                                color='success'
                                label="Cliente"
                                size='medium'
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                sx={{ width: '100%', minWidth: "300px" }}
                            >
                                {customers.map((value) => (
                                    <MenuItem key={value.id_user} value={value}>
                                        <Typography sx={{ color: theme?.palette?.type === 'dark' ? 'green' : 'black' }} > {String(value.name).toUpperCase()}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box border={1} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100px", backgroundColor: "", padding: "10px", borderRadius: "5px" }}>
                            <Typography>Contato: <strong>{selectedCustomer?.phone}</strong></Typography>
                            <Typography>E-mail: <strong>{selectedCustomer?.email}</strong></Typography>
                            <Typography>CPF: <strong>{selectedCustomer?.cpf}</strong></Typography>
                        </Box>


                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="product-label" color='success' sx={{ width: '100%', color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>Produto</InputLabel>
                                <Select
                                    label="Produto"
                                    color='success'
                                    labelId="product-label"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    sx={{ width: '100%', minWidth: "300px" }}
                                >
                                    {products.map((value) => (
                                        <MenuItem key={value.id_product} value={value}>
                                            <Typography sx={{ color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>{String(value.type).toUpperCase()}</Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box border={1} sx={{ borderRadius: "5px", paddingLeft: "10px", height: "60px", backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "#F5F5F5", color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>
                                <Typography>Preço: <strong>{selectedProduct?.sale_price}</strong></Typography>
                                <Typography>Estoque: <strong>{selectedProduct?.inventory?.amount}</strong></Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3} >
                            <FormControl fullWidth color='success' margin="normal">

                                <TextField
                                    color='success'
                                    inputProps={{ min: 0 }}
                                    sx={{ minWidth: "300px", color: "green", backgroundColor: theme?.palette?.type === 'dark' ? 'green' : '#f3f3f3' }}
                                    type="number"
                                    InputProps={{
                                        min: 1
                                    }}
                                    label="Quantidade"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                sx={{ width: "200px" }}
                                variant="outlined"
                                color="success"
                                onClick={handleAddItem}
                            >
                                Adicionar Item
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Sales;
