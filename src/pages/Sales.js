import React, { useEffect, useState, useContext } from 'react';
import ThemeContext from "../components/style/ThemeContext";
import productService from "../services/product/product-service";
import saleService from "../services/sale/sale-service";
import userService from "../services/user/user-service";
import { TextField, Box, Grid, Typography, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../services/auth/AuthContext';

const Sales = () => {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const { theme } = useContext(ThemeContext);
    const [sale, setSale] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(0);
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
            toast.warning('Por favor selecione o produto e insira a quantidade!')
        } else {
            const selectedProductInventory = selectedProduct?.inventory?.amount;

            if (amount < 1 || amount > selectedProductInventory) {
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
        console.log('items', items)
        if (selectedCustomer === null) {
            toast.warning('Por favor selecione o cliente!');
        } else if (items.length === 0 ) {
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

    return (
        <Grid container spacing={2}>
            <ToastContainer />
            <Grid item xs={6}>
                <Box>
                    <Typography variant="subtitle1">Procedimento: <strong>Venda</strong></Typography>
                    <Typography variant="subtitle1">Data: <strong>{currentDate}</strong></Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth margin="normal" sx={{ marginTop: '15px' }}>
                    <InputLabel id="customer-label">Clientes</InputLabel>
                    <Select
                        labelId="customer-label"
                        sx={{ marginTop: '5px' }}
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                        {customers.map((value) => (
                            <MenuItem key={value.id_user} value={value}>
                                {String(value.name).toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    {selectedCustomer !== null && <Typography>Contato: <strong>{selectedCustomer.phone}</strong></Typography>}
                    {selectedCustomer !== null && <Typography>E-mail: <strong>{selectedCustomer.email}</strong></Typography>}
                </Box>
                {selectedCustomer !== null && <Typography>CPF: <strong>{selectedCustomer?.cpf}</strong></Typography>}
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
                    {selectedProduct !== 0 && <Typography>Preço: <strong>{selectedProduct?.sale_price}</strong></Typography>}
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
                            Preço: {item.sale_price}
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
                        onClick={() => createSale()}
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        Finalizar Venda
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Sales;
