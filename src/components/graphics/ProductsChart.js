import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import saleItemService from "../../services/sale/sale-item-service";
import purchaseItemService from "../../services/purchase/purchase-item-service";

const ProductsChart = () => {
    const [saleItems, setSaleItems] = useState([]);
    const [purchaseItems, setPurchaseItems] = useState([]);

    useEffect(() => {
        saleItemService.getAllSaleItems().then(response => {
            if (response.status === 200) {
                setSaleItems(response.data.saleItems);
            }
        });
    }, []);

    useEffect(() => {
        purchaseItemService.getAllPurchaseItems().then(response => {
            if (response.status === 200) {
                setPurchaseItems(response.data.purchaseItems);
            }
        });
    }, []);




    const prepareChartData = () => {
        const chartData = {
            labels: [],
            datasets: [
                {
                    label: 'Vendas (kg)',
                    backgroundColor: '#00C853',
                    data: [],
                    barPercentage: 1,

                },
                {
                    label: 'Compras (kg)',
                    backgroundColor: '#2196F3',
                    data: [],
                    barPercentage: 1,
                },
            ],
        };

        const products = {};
        const allItems = [...saleItems, ...purchaseItems];

        const uniqueProductNames = new Set(allItems.map(item => item.product_name));

        chartData.labels = Array.from(uniqueProductNames);
        allItems.forEach(item => {
            const { product_id, product_name, amount } = item;

            if (!products[product_id]) {
                products[product_id] = {
                    product_name,
                    sales: 0,
                    purchases: 0,
                };
            }
            if (saleItems.some(saleItem => saleItem.product_id === product_id && item.id_sale_item)) {
                products[product_id].sales += amount;
            } else if (purchaseItems.some(purchaseItem => purchaseItem.product_id === product_id && item.id_purchase_item )) {
                products[product_id].purchases += amount;
            } 


        });

        chartData.labels.forEach(label => {
            const product = Object.values(products).find(p => p.product_name === label);
            chartData.datasets[0].data.push(product.sales);
            chartData.datasets[1].data.push(product.purchases);
        });

        return chartData;
    };

    const chartData = prepareChartData();

    return (
        <div style={{ display: "flex", width: "900px", justifyContent: "space-between" }}>
            <div style={{ width: "900px", height: "400px" }}>
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />

            </div>
        </div>
    );
};

export default ProductsChart;