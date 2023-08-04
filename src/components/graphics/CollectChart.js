import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import collectService from '../../services/collect/collect-service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Typography } from '@mui/material';

const CollectChart = () => {
    const chartRef = useRef(null);
    const [startDate, setStartDate] = useState(moment().startOf('day').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate());
    const [collects, setCollects] = useState([]);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

            try {
                const response = await collectService.findBeteweenDate(formattedStartDate, formattedEndDate);
                setCollects(response.data);
            } catch (error) {
                console.log('Erro ao buscar dados de coleta:', error);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    useEffect(() => {
        const groupedCollects = collects.reduce((groups, collect) => {
            const { status } = collect;
            if (!groups[status]) {
                groups[status] = 0;
            }
            groups[status]++;
            return groups;
        }, {});

        const labels = Object.keys(groupedCollects);
        const data = Object.values(groupedCollects);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Quantidade',
                        data: data,
                        backgroundColor: '#3D9532',
                        borderColor: '#000',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0,
                        stepSize: 1,
                    },
                },
            },
        });
    }, [collects]);

    return (
        <Box style={{ width: "100%", height: "40vh", display: "flex",  }}>
            <Box width="100%">
                
                <Box  padding= {2}>
                    <Box sx={{height: "300px" }}>
                        <canvas ref={chartRef}></canvas>
                    </Box>
                </Box>
            <Box sx={{ display: "flex", flexDirection: "collumn", alignItems: "center", height: "100px", padding: 2 }}>
                    <Typography fontSize={20} >Período de coleta: </Typography>
                    <DatePicker
                        dateFormat="dd/MM/yyyy"
                        locale="pt"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        /> <Typography mx={1}>a</Typography>
                    <DatePicker
                        dateFormat="dd/MM/yyyy"
                        locale="pt"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        />
                </Box>
                </Box>
            {/* <Box width="50%" display="flex" alignItems="flex-end" >
                <CardMedia
                    component="img"
                    height="400"
                    image={truck}
                    alt="Caminhão de reciclagem"
                    sx={{objectFit: 'contain'}}
                />
            </Box> */}

        </Box>
    );
};

export default CollectChart;
