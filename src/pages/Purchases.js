import React, { useEffect, useState, useContext } from 'react';
import productService from "../services/product/product-service";
import purchaseService from '../services/purchase/purchase-service';
import userService from "../services/user/user-service";
import { TextField, Box, Grid, Typography, FormControl, InputLabel, MenuItem, Select, Button, Paper, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, List, ListItem, ListItemText } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../services/auth/AuthContext';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThemeContext from '../components/style/ThemeContext';

const Purchases = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [purchase, setPurchase] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [amount, setAmount] = useState(0);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        userService.getSellers()
            .then(response => {
                if (response.status === 200) {
                    setSellers(response.data);
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
    }, [items, purchase]);

    const calculateSubtotal = (item) => {
        return item.amount * item.purchase_price;
    };

    const handleAddItem = () => {
        if (selectedProduct === null || amount < 1) {
            toast.warning('Por favor selecione o produto e insira a quantidade!')
        } else {

            if (amount < 1) {
                return; // Não adiciona o item se a quantidade for menor que 1 ou maior que o estoque disponível
            }

            const existingItemIndex = items.findIndex(item => item.product_id === selectedProduct.id_product);

            if (existingItemIndex !== -1) {
                const updatedItems = [...items];
                const updatedAmount = updatedItems[existingItemIndex].amount + parseInt(amount);


                updatedItems[existingItemIndex].amount = updatedAmount;
                updatedItems[existingItemIndex].subtotal = calculateSubtotal(updatedItems[existingItemIndex]);
                setItems(updatedItems);
            } else {
                const newItem = {
                    product_id: selectedProduct.id_product,
                    amount: parseInt(amount),
                    product_name: selectedProduct.type,
                    purchase_price: selectedProduct.purchase_price,
                    subtotal: calculateSubtotal({
                        amount: parseInt(amount),
                        purchase_price: selectedProduct.purchase_price
                    })
                };
                setItems([...items, newItem]);
            }

            setSelectedProduct(null);
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

    const createPurchase = () => {
        if (selectedSeller === null) {
            toast.warning('Por favor selecione o fornecedor!')
        } else if (items.length === 0) {
            toast.warning('Por favor adicione pelo menos 1 item antes de finalizar a compra!');
        } else {
            const purchase = {
                customer_id: user.id,
                seller_id: selectedSeller.id_user,
                purchaseItems: items
            }
            purchaseService.create(purchase).then(response => {
                if (response.status === 201) {
                    toast.success('Compra efetuada com sucesso!');
                    if (!purchase) {
                        setPurchase(false);
                    } else {
                        setPurchase(true);
                    }
                }
            }).catch(error => {
                toast.error(`Não foi possível efetuar a compra. ${error.response.data.message}`)
            })
            setItems([]);
            setSelectedProduct(0);
            setSelectedSeller(null);
        }
    }

    const clearPurchase = () => {
        setItems([]);
        setSelectedProduct(0);
        setSelectedSeller(null);
    }
    return (
        <Grid container display="flex" justifyContent="center" height="100%" overflow='auto'>
            <ToastContainer />
            <Grid item xs={12} width="100%" display="flex" alignItems="center" justifyContent="center" >
                <Box component={Paper} elevation={2} width="100%" height="95%" p={1} display="flex" justifyContent="space-evenly" sx={{ backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "", color: theme?.palette?.type === 'dark' ? 'green' : 'black', border: theme?.palette?.type === 'dark' ? 'green 1px solid' : "" }}>
                    <Box width="60%">

                        <Box sx={{ maxHeight: "95%", overflowY: "auto" }}>
                            <TableContainer>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'green' }}>Código</TableCell>
                                            <TableCell sx={{ color: 'green' }}>Produto</TableCell>
                                            <TableCell sx={{ color: 'green' }}>Quantidade</TableCell>
                                            <TableCell sx={{ color: 'green' }}>Subtotal</TableCell>
                                            <TableCell sx={{ color: 'green' }}>Remover</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography sx={{ color: 'green' }}>
                                                        <strong >{item.product_id}</strong>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'green' }}>
                                                        {String(item.product_name).toUpperCase()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'green' }}>
                                                        <strong>{item.amount} Un.</strong>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'green' }}><strong>R$ {String(item.subtotal).substring(0, 6)}</strong></Typography>
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

                    </Box>
                    <Box width="35%" py={3} border={2} borderColor="green" display="flex" justifyContent="center" alignItems="center" >

                        <Grid item xs={12} sm={9} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
                            <Box width="100%"  >
                                <FormControl fullWidth margin="normal">
                                    <InputLabel color='success' sx={{ width: '100%', color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>Fornecedor</InputLabel>
                                    <Select
                                        labelId="customer-label"
                                        color='success'
                                        label="Fornecedor"
                                        size='small'
                                        value={selectedSeller}
                                        onChange={(e) => setSelectedSeller(e.target.value)}
                                        sx={{ width: '100%', height: 50 }}
                                    >
                                        {sellers.map((value) => (
                                            <MenuItem key={value.id_user} value={value}>
                                                <Typography sx={{ color: theme?.palette?.type === 'dark' ? 'green' : 'black' }} > {String(value.name).toUpperCase()}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%" sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100px", minHeight: "100px", backgroundColor: "" }}>

                                <List>
                                    <ListItem sx={{ borderBottom: 1, borderColor: "green", height: 25 }}>
                                        <ListItemText primary={`${selectedSeller?.phone || ""}`} />
                                    </ListItem>
                                    <ListItem sx={{ borderBottom: 1, borderColor: "green", height: 25 }}>
                                        <ListItemText primary={`${selectedSeller?.email || ""}`} />
                                    </ListItem>
                                    <ListItem sx={{ borderBottom: 1, borderColor: "green", height: 25 }}>
                                        <ListItemText primary={`${selectedSeller?.document || ""}`} />
                                    </ListItem>
                                </List>
                            </Box>


                            <Box width="100%" minWidth={300} display="flex" justifyContent="center" flexDirection="column" >
                                <Box width="100%" >
                                    <FormControl fullWidth margin="normal" sx={{ marginLeft: 0, paddingLeft: 0 }} >
                                        <InputLabel id="product-label" color='success' sx={{ color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>Produto</InputLabel>
                                        <Select
                                            label="Produto"
                                            color='success'
                                            labelId="product-label"
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                            sx={{ width: '100%' }}
                                        >
                                            {products.map((value) => (
                                                <MenuItem key={value.id_product} value={value}>
                                                    <Typography sx={{ color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>{String(value.type).toUpperCase()}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box border={1} width="100%" borderColor="green" sx={{ borderRadius: "5px", height: "60px", backgroundColor: theme?.palette?.type === 'dark' ? theme.palette?.primary?.main : "", color: theme?.palette?.type === 'dark' ? 'green' : 'black' }}>
                                    <Box height="100%" display="flex" justifyContent="space-around" alignItems="center">
                                        <Box>
                                            <Typography >Preço: <strong>{selectedProduct?.purchase_price}</strong></Typography>

                                        </Box>
                                        <Box>

                                            <Typography >Estoque: <strong>{selectedProduct?.inventory?.amount}</strong></Typography>
                                        </Box>
                                    </Box>

                                </Box>
                            </Box>
                            <Box display="flex" width="100%" height={50} alignItems="center" justifyContent="space-around" >
                                <Box >
                                    <FormControl fullWidth color='success' margin="normal">

                                        <TextField
                                            color='success'
                                            inputProps={{ min: 0 }}
                                            sx={{ width: "100px", color: "green", backgroundColor: theme?.palette?.type === 'dark' ? 'green' : '' }}
                                            type="number"
                                            InputProps={{
                                                min: 1
                                            }}
                                            size='small'
                                            label="Quantidade"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </FormControl>
                                </Box>
                                <Box marginLeft={1}  >
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={handleAddItem}
                                        sx={{ height: 40, mt: 1 }}
                                    >
                                        Adicionar Item
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                    </Box>
                </Box>
            </Grid>
            <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" height={40} mb={2} mt={1}>
                <Box ml={1}>
                    <Typography fontSize={20} variant="subtitle1"><strong>{currentDate}</strong></Typography>
                </Box>
                <Box width={400}>
                    {total > 0 && <Typography ml={2} fontSize={28} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Total Compra R$: <strong style={{ paddingLeft: "10px" }}>{total.toFixed(2)}</strong></Typography>}
                </Box>
                <Box minWidth={500} width="35%" display="flex" justifyContent="center">
                    <Button
                        sx={{ height: 50, width: 200, fontSize: 16, fontWeight: 700 }}
                        variant="contained"
                        color="success"
                        disabled={items.length === 0}
                        onClick={createPurchase}
                    >
                        Finalizar Compra
                    </Button>
                    <Button
                        sx={{ height: 50, width: 200, marginLeft: 3, fontSize: 16, fontWeight: 700 }}
                        variant="outlined"
                        color="error"
                        disabled={items.length === 0}
                        onClick={clearPurchase}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export default Purchases;
