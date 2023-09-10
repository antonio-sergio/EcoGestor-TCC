import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';
import productService from '../../services/product/product-service';


const ProductForm = () => {
    const [product, setProduct] = useState({
        type: '',
        sale_price: '',
        purchase_price: '',
        amount: '',
    });
    const [added, setAdded] = useState(false);


    function convertCurrencyStringToFloat(currencyString) {
        // Remove os espaços em branco da string
        const trimmedString = currencyString.trim();

        // Verifica se a string já está no formato correto
        if (/^\d+(\.\d+)?$/.test(trimmedString)) {
            return parseFloat(trimmedString);
        }

        // Remove os caracteres não numéricos da string (exceto o ponto ou a vírgula)
        const numericString = trimmedString.replace(/[^0-9.,]/g, '');

        // Substitui a vírgula por ponto, se necessário
        const floatString = numericString.replace(',', '.');

        // Converte a string para um número de ponto flutuante
        const floatValue = parseFloat(floatString);

        return floatValue;
    }

    const handleChange = (e) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let productFinal = {
            type: product.type,
            sale_price: convertCurrencyStringToFloat(product.sale_price),
            purchase_price: convertCurrencyStringToFloat(product.purchase_price),
            amount: product?.amount || 0,
        }
        productService.create(productFinal).then(response => {
            if (response.status === 201) {
                toast.success('Produto adicionado com sucesso!');
                resetForm();
            }
        }).catch(error => {
            console.log(error);
            toast.error(`${error.response.data.message}`);
        })
    };



    const resetForm = () => {
        setProduct({
            type: '',
            sale_price: '',
            purchase_price: '',
            amount: '',
        });
        setAdded(true);
    };


    return (
        <div style={{ maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
            <ToastContainer />
            {added === false ? <form onSubmit={handleSubmit}>
                <Grid container sx={{ justifyContent: 'center', overflow: 'auto' }} spacing={2}>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3} >
                        <TextField
                            label="Nome"
                            name="type"
                            value={product.type}
                            onChange={handleChange}
                            required
                            fullWidth
                            
                        />
                    </Grid>

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <NumericFormat
                            label="Preço de Compra"
                            name="purchase_price"
                            value={product.purchase_price}
                            customInput={TextField}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    
                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <NumericFormat
                            label="Preço de Venda"
                            name="sale_price"
                            value={product.sale_price}
                            customInput={TextField}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>

                    

                    <Grid item m={2} xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            label="Quantidade"
                            name="amount"
                            type="number"
                            inputProps={{
                                min: 0
                            }}
                            value={product.amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>


                    <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                        <Button sx={{ height: 53 }} type="submit" variant="contained" color="success" fullWidth>
                            adicionar
                        </Button>
                    </Grid>
                </Grid>
            </form> : <Grid
                container
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 450px)',
                }}
            >
                <Grid item m={2} xs={6} sm={5} md={4} lg={3}>
                    <Button
                        sx={{ height: 53 }}
                        type="button"
                        onClick={() => setAdded(false)}
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        adicionar novo produto
                    </Button>
                </Grid>
            </Grid>}
        </div >
    );
}

export default ProductForm;