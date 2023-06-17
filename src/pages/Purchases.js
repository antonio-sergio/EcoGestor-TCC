import React, { useEffect, useState, useContext } from 'react';
import ThemeContext from "../components/style/ThemeContext";
import productService from "../services/product/product-service";
import purchaseService from '../services/purchase/purchase-service';
import userService from "../services/user/user-service";
import { TextField, Box, Grid, Typography, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../services/auth/AuthContext';

const Purchases = () => {
    const { user } = useContext(AuthContext);
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const { theme } = useContext(ThemeContext);
    const [purchase, setPurchase] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(0);
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
       if(selectedProduct === 0 || amount < 1){ 
            toast.warning('Por favor selecione o produto e insira a quantidade!')
       }else{

        if (amount < 1 ) {
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

    console.log('selected product', selectedProduct);
    const currentDateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const currentDate = new Date().toLocaleDateString(undefined, currentDateOptions);

    const createPurchase = () => {
        if (selectedSeller === null) {
            toast.warning('Por favor selecione o vendedor!')
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

    return (
        <Grid container spacing={2}>
            <ToastContainer />
            <Grid item xs={6}>
                <Box>
                    <Typography variant="subtitle1">Procedimento: <strong>COMPRA</strong></Typography>
                    <Typography variant="subtitle1">Data: <strong>{currentDate}</strong></Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth margin="normal" sx={{ marginTop: '15px' }}>
                    <InputLabel id="seller-label">Vendedores</InputLabel>
                    <Select
                        labelId="seller-label"
                        sx={{ marginTop: '5px' }}
                        value={selectedSeller}
                        onChange={(e) => setSelectedSeller(e.target.value)}
                    >
                        {sellers.map((value) => (
                            <MenuItem key={value.id_user} value={value}>
                                {String(value.name).toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    {selectedSeller !== null && <Typography>Contato: <strong>{selectedSeller.phone}</strong></Typography>}
                    {selectedSeller !== null && <Typography>E-mail: <strong>{selectedSeller.email}</strong></Typography>}
                </Box>
                {selectedSeller !== null && <Typography>CPF: <strong>{selectedSeller?.cpf}</strong></Typography>}
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                <Grid item xs={2}>
                    <FormControl fullWidth margin="normal" sx={{ marginTop: '15px' }}>
                        <InputLabel id="product-label">Produtos</InputLabel>
                        <Select
                            labelId="product-label"
                            sx={{ marginTop: '5px' }}
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            {products.map((value) => (
                                <MenuItem key={value.id_product} value={value}>
                                    {String(value.type).toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedProduct !== 0 && <Typography>Preço: <strong>{selectedProduct?.purchase_price}</strong></Typography>}
                    {selectedProduct !== 0 && <Typography>Estoque: <strong>{selectedProduct?.inventory?.amount}</strong></Typography>}
                    <Button variant="contained" onClick={handleAddItem}>Adicionar Item</Button>
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        sx={{ marginTop: '20px' }}
                        label="Quantidade"
                        name="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Itens adicionados:</Typography>
                {items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <Typography>
                            Produto: {item.product_name}
                        </Typography>
                        <Typography>
                            Código: {item.product_id}
                        </Typography>
                        <Typography>
                            Quantidade: {item.amount}
                        </Typography>
                        <Typography>
                            Preço: {item.purchase_price}
                        </Typography>
                        <Typography>
                            Subtotal: {item.subtotal}
                        </Typography>
                        <Button variant="outlined" onClick={() => handleRemoveItem(index)}>Remover</Button>
                    </Box>
                ))}
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Total: {total}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                    <Button
                        sx={{ height: 53 }}
                        type="button"
                        onClick={() => createPurchase()}
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        Finalizar Compra
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};


export default Purchases;