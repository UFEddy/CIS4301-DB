import React, { useState } from 'react';
import { fetchQuery2Results } from '../services/apiService';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function QueryHomeVsAwayPerformanceBySeason_2() {
    const [seasonYear, setSeasonYear] = useState('');
    const [chartData, setChartData] = useState(null);

    const fetchData = async () => {
        try {
            const data = await fetchQuery2Results(seasonYear);
            const filteredData = data.filter(d => d.GAMETYPE !== null);
            const months = [...new Set(filteredData.map(d => d.MONTH))];
            const homeData = months.map(month =>
                filteredData.find(d => d.MONTH === month && d.GAMETYPE === 'Home')?.AVERAGEWAR || 0
            );
            const awayData = months.map(month =>
                filteredData.find(d => d.MONTH === month && d.GAMETYPE === 'Away')?.AVERAGEWAR || 0
            );
            setChartData({
                labels: months,
                datasets: [
                    {
                        label: 'Home Performance',
                        data: homeData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        fill: true,
                    },
                    {
                        label: 'Away Performance',
                        data: awayData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '10px' }}>Query 2: Monthly Player Performance: Home vs Away</h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                Analyze the average WAR performance of all players. Display the result by month with two values: Home and Away games
                for the selected season year.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Season Year"
                    value={seasonYear}
                    onChange={(e) => setSeasonYear(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <button
                    onClick={fetchData}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#28a745',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Fetch Data
                </button>
            </div>
            {chartData ? (
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) =>
                                            `${context.dataset.label}: ${context.raw.toFixed(2)}`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Month',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Average WAR',
                                    },
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <p style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
                    Enter a season year and click "Fetch Data" to see results.
                </p>
            )}
        </div>
    );
}
export default QueryHomeVsAwayPerformanceBySeason_2;