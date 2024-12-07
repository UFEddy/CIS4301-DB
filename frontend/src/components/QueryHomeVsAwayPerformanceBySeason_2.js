import React, { useState } from 'react';
import { fetchQuery2Results } from '../services/apiService';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Query2Placeholder() {
    const [seasonYear, setSeasonYear] = useState('');
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
                        label: 'Home',
                        data: homeData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                    {
                        label: 'Away',
                        data: awayData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Query 2: Home vs Away WAR</h2>
            <div>
                <input
                    type="text"
                    placeholder="Season Year"
                    value={seasonYear}
                    onChange={(e) => setSeasonYear(e.target.value)}
                />
                <button onClick={fetchData}>Fetch Data</button>
            </div>
            {chartData && (
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <Bar data={chartData} />
                </div>
            )}
        </div>
    );
}
export default Query2Placeholder;