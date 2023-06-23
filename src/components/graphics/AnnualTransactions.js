import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import saleService from '../../services/sale/sale-service';
import purchaseService from '../../services/purchase/purchase-service';

function AnnualTransactions() {
    const chartRef = useRef(null);
    const [salesData, setSalesData] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await saleService.getAllSale();
                if (response.status === 200) {
                    setSalesData(response.data.sales);
                }
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await purchaseService.getAllPurchase();
                if (response.status === 200) {
                    setPurchaseData(response.data.purchases);
                }
            } catch (error) {
                console.error('Error fetching purchases data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            const months = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
            ];

            const monthlySalesData = {};
            const monthlyPurchaseData = {};

            months.forEach(month => {
                monthlySalesData[month] = {
                    total: 0,
                    count: 0
                };

                monthlyPurchaseData[month] = {
                    total: 0,
                    count: 0
                };
            });

            salesData.forEach(sale => {
                const monthYear = sale.createdAt.slice(5, 7);
                const month = months[parseInt(monthYear, 10) - 1];
                monthlySalesData[month].total += parseFloat(sale.total);
                monthlySalesData[month].count += 1; // Increment the count for each sale
            });

            purchaseData.forEach(purchase => {
                const monthYear = purchase.createdAt.slice(5, 7);
                const month = months[parseInt(monthYear, 10) - 1];
                monthlyPurchaseData[month].total += parseFloat(purchase.total);
                monthlyPurchaseData[month].count += 1; // Increment the count for each purchase
            });

            const labels = Object.keys(monthlySalesData);
            const salesTotals = Object.values(monthlySalesData).map(data => data.total);
            const salesCounts = Object.values(monthlySalesData).map(data => data.count);
            const purchaseTotals = Object.values(monthlyPurchaseData).map(data => data.total);
            const purchaseCounts = Object.values(monthlyPurchaseData).map(data => data.count);

            const chartConfig = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total de Vendas R$',
                            data: salesTotals,
                            backgroundColor: [
                                'rgba(0, 255, 0, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba( 240, 255, 240, 1)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)',
                                'rgba(255, 0, 0, 0.2)',
                                'rgba(0, 0, 255, 0.2)',
                                'rgba(255, 255, 0, 0.2)',
                                'rgba(255, 0, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgb(0,250,154)',
                                'rgb(75, 192, 192)',
                                'rgb(255, 99, 132)',
                                'rgb(0,255,255)',
                                'rgb(255, 205, 86)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)',
                                'rgb(255, 146, 132)',
                                'rgb(147,112,219)',
                                'rgb(255,255,0)',
                                'rgb(255,215,0)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Total de Compras R$',
                            data: purchaseTotals,
                            backgroundColor: [
                                'rgba(255, 0, 0, 0.2)',
                                'rgba(0, 0, 255, 0.2)',
                                'rgba(255, 255, 0, 0.2)',
                                'rgba(255, 0, 255, 0.2)',
                                'rgba(0, 255, 0, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba( 240, 255, 240, 1)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)',
                            ],
                            borderColor: [
                                'rgb(255, 0, 0)',
                                'rgb(0, 0, 255)',
                                'rgb(255, 255, 0)',
                                'rgb(255, 0, 255)',
                                'rgb(0,250,154)',
                                'rgb(75, 192, 192)',
                                'rgb(255, 99, 132)',
                                'rgb(0,255,255)',
                                'rgb(255, 205, 86)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)',
                            ],
                            borderWidth: 1
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 10,
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const datasetIndex = context.datasetIndex;
                                    const dataIndex = context.dataIndex;
                    
                                    if (datasetIndex === 0) {
                                        // Dados de Vendas
                                        const salesTotal = salesTotals[dataIndex];
                                        const salesCount = salesCounts[dataIndex];
                                        return `Qtd: ${salesCount}\nTotal: R$ ${salesTotal}`;
                                    } else if (datasetIndex === 1) {
                                        // Dados de Compras
                                        const purchaseTotal = purchaseTotals[dataIndex];
                                        const purchaseCount = purchaseCounts[dataIndex];
                                        return `Qtd: ${purchaseCount}\nTotal: R$ ${purchaseTotal}`;
                                    }
                    
                                    return '';
                                }
                            }
                        }
                    }
                    
                },
            };

            if (chartInstance) {
                chartInstance.destroy();
            }

            const newChartInstance = new Chart(chartRef.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [salesData, purchaseData]);

    const totalSales = salesData.length;
    const totalPurchases = purchaseData.length;

    return (
        <div>
            <canvas ref={chartRef} />
            <div>Quantidade de Vendas: {totalSales}</div>
            <div>Quantidade de Compras: {totalPurchases}</div>
        </div>
    );
}

export default AnnualTransactions;