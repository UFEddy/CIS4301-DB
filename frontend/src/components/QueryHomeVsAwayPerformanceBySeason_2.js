import React, { useState } from 'react';
import { fetchQuery2Results } from '../services/apiService';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function QueryHomeVsAwayPerformanceBySeason_2() {
    const [seasonYear, setSeasonYear] = useState('');
    const [metric, setMetric] = useState('WAR');
    const [chartData, setChartData] = useState(null);

    const fetchData = async () => {
        try {
            const data = await fetchQuery2Results(seasonYear);
            const homeData = data.filter(d => d.GameType === 'Home').map(d => parseFloat(d.AverageWAR));
            const awayData = data.filter(d => d.GameType === 'Away').map(d => parseFloat(d.AverageWAR));
            const labels = [...new Set(data.map(d => d.Year))];

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Home Performance',
                        data: homeData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Away Performance',
                        data: awayData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '10px' }}>Query 2: Player Performance: Home vs Away</h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                Evaluates the difference in player performance when playing at home versus on the road.
                Users can select a specific season year to analyze how performance metrics like WAR
                vary depending on the game location. The results are displayed in an interactive graph that provides insights
                into player effectiveness in home versus away settings.
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
                    <Bar
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
                                        text: 'Year',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: metric,
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