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




    // Prepare data for the chart
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

        // Calculate total sales for each product
        saleItems.forEach(saleItem => {
            const { product_id, product_name, item_total, amount } = saleItem;

            if (!products[product_id]) {
                console.log('ififififif')
                products[product_id] = {
                    product_name,
                    sales: amount,
                    purchases: 0,
                };
                chartData.labels.push(product_name);
            } else {
                console.log('else elese else')

                products[product_id].sales += amount;
            }
        });

        // Calculate total purchases for each product
        purchaseItems.forEach(purchaseItem => {
            const { product_id, product_name, amount } = purchaseItem;

            if (!products[product_id]) {
                products[product_id] = {
                    product_name,
                    sales: 0,
                    purchases:  amount,
                };
                chartData.labels.push(product_name);
            } else {
                products[product_id].purchases += amount;
            }
        });

        Object.values(products).forEach(({ sales, purchases }) => {
            chartData.datasets[0].data.push(sales);
            chartData.datasets[1].data.push(purchases);
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