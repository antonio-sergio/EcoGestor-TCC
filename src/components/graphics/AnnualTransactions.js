import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import saleService from '../../services/sale/sale-service';
import purchaseService from '../../services/purchase/purchase-service';

function AnnualTransactions() {
    const chartRef = useRef(null);
    const projectionChartRef = useRef(null);
    const [salesData, setSalesData] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);
    const [projectionChartInstance, setProjectionChartInstance] = useState(null);

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
                            backgroundColor: 'rgba(0, 255, 0, 0.2)',
                            borderColor: 'rgb(0, 250, 154)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total de Compras R$',
                            data: purchaseTotals,
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            borderColor: 'rgb(255, 0, 0)',
                            borderWidth: 1
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                label: function (context) {
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

            // Calculate projection for current month
            const currentMonthIndex = new Date().getMonth();
            const lastFiveMonthsSales = salesTotals.slice(currentMonthIndex - 5, currentMonthIndex).filter((_, i) => i !== currentMonthIndex);
            const lastFiveMonthsPurchases = purchaseTotals.slice(currentMonthIndex - 5, currentMonthIndex).filter((_, i) => i !== currentMonthIndex );
            const salesProjection = lastFiveMonthsSales.reduce((total, value) => total + value, 0) / 5;
            const purchasesProjection = lastFiveMonthsPurchases.reduce((total, value) => total + value, 0) / 5;

            // Create projection chart
            const projectionChartConfig = {
                type: 'line',
                data: {
                    labels: ['Vendas', 'Compras'],
                    datasets: [
                        {
                            label: 'Valor Atual',
                            data: [salesTotals[currentMonthIndex], purchaseTotals[currentMonthIndex]],
                            borderColor: '#1E90FF',
                            backgroundColor: '#2196F3',
                            borderWidth: 1
                        },
                        {
                            label: 'Projeção',
                            data: [salesProjection, purchasesProjection],
                            borderColor: '#B22222',
                            backgroundColor: '#FF1744',
                            borderWidth: 1
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                label: function (context) {
                                    const datasetIndex = context.datasetIndex;
                                    const dataIndex = context.dataIndex;

                                    if (datasetIndex === 0) {
                                        return `Valor Atual: R$ ${context.raw}`;
                                    } else if (datasetIndex === 1) {
                                        return `Projeção: R$ ${context.raw}`;
                                    }

                                    return '';
                                }
                            }
                        }
                    }
                },
            };

            if (projectionChartInstance) {
                projectionChartInstance.destroy();
            }

            const newProjectionChartInstance = new Chart(projectionChartRef.current, projectionChartConfig);
            setProjectionChartInstance(newProjectionChartInstance);
        }
    }, [salesData, purchaseData]);

    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <div style={{ width: "45%", height: "40vh" }}>
                <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ width: "45%", height: "40vh" }}>
                <canvas ref={projectionChartRef} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
}

export default AnnualTransactions;
