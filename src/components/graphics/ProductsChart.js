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
                    backgroundColor: 'green',
                    data: [],
                },
                {
                    label: 'Compras (kg)',
                    backgroundColor: 'blue',
                    data: [],
                },
            ],
        };

        const products = {};

        // Calculate total sales for each product
        saleItems.forEach(saleItem => {
            const { product_id, product_name, item_total } = saleItem;

            if (!products[product_id]) {
                products[product_id] = {
                    product_name,
                    sales: parseFloat(item_total),
                    purchases: 0,
                };
                chartData.labels.push(product_name);
            } else {
                products[product_id].sales += parseFloat(item_total);
            }
        });

        // Calculate total purchases for each product
        purchaseItems.forEach(purchaseItem => {
            const { product_id, product_name, item_total } = purchaseItem;

            if (!products[product_id]) {
                products[product_id] = {
                    product_name,
                    sales: 0,
                    purchases: parseFloat(item_total),
                };
                chartData.labels.push(product_name);
            } else {
                products[product_id].purchases += parseFloat(item_total);
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
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <div style={{ width: "100%", height: "40vh" }}>
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