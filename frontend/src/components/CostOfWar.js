import React, { useState, useEffect } from 'react';
import {
    ComposedChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

function CostOfWAR() {
    // State for league data
    const [leagueData, setLeagueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchLeagueData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/league-data');
                if (!response.ok) {
                    throw new Error(`Failed to fetch league data: ${response.status}`);
                }
                const data = await response.json();
                // Calculate cost per WAR for each year
                const enrichedData = data.map((item) => ({
                    ...item,
                    avgCostPerWAR: item.AvgSalary / item.AvgWAR || 0,
                    totalCostPerWAR: item.TotalSalary / item.TotalWAR || 0,
                }));
                setLeagueData(enrichedData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeagueData();
    }, []);

    // Display loading state
    if (loading) {
        return <p>Loading data...</p>;
    }

    // Display error state
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    // Ensure there's data to display
    if (!leagueData || leagueData.length === 0) {
        return <p>No data available.</p>;
    }

    const firstYear = leagueData[0];
    const lastYear = leagueData[leagueData.length - 1];

    // Handle cases where avgCostPerWAR or similar fields might not exist
    const avgCostChange =
        (lastYear.avgCostPerWAR || 0) - (firstYear.avgCostPerWAR || 0);
    const avgWARChange = (lastYear.AvgWAR || 0) - (firstYear.AvgWAR || 0);
    const avgValueChange =
        avgWARChange !== 0 ? avgCostChange / avgWARChange : 0;

    const totalCostChange =
        (lastYear.totalCostPerWAR || 0) - (firstYear.totalCostPerWAR || 0);
    const totalWARChange = (lastYear.TotalWAR || 0) - (firstYear.TotalWAR || 0);
    const totalValueChange =
        totalWARChange !== 0 ? totalCostChange / totalWARChange : 0;

    const summary = (
        <p>
            The average cost to buy a single WAR has changed from{' '}
            <strong>${(firstYear.avgCostPerWAR || 0).toFixed(2)}M</strong> to{' '}
            <strong>${(lastYear.avgCostPerWAR || 0).toFixed(2)}M</strong>, while the
            average production of WAR has changed from{' '}
            <strong>{(firstYear.AvgWAR || 0).toFixed(2)}</strong> to{' '}
            <strong>{(lastYear.AvgWAR || 0).toFixed(2)}</strong>, creating a value
            change of{' '}
            <strong>${avgValueChange.toFixed(2)}M per WAR</strong>.
            <br />
            For the overall league-wide production, the cost to buy a single WAR has
            changed from{' '}
            <strong>${(firstYear.totalCostPerWAR || 0).toFixed(2)}M</strong> to{' '}
            <strong>${(lastYear.totalCostPerWAR || 0).toFixed(2)}M</strong>, while the
            total WAR production has changed from{' '}
            <strong>{firstYear.TotalWAR || 0}</strong> to{' '}
            <strong>{lastYear.TotalWAR || 0}</strong>, creating a value change of{' '}
            <strong>${totalValueChange.toFixed(2)}M per WAR</strong>.
        </p>
    );

    return (
        <div>
            <h1>Cost of WAR Analysis</h1>
            {summary}
            <ResponsiveContainer width="90%" height={400}>
                <ComposedChart data={leagueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="Season"
                        label={{ value: 'Season', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                        yAxisId="left"
                        label={{ value: 'Average WAR', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                            value: 'Average Salary (M)',
                            angle: -90,
                            position: 'insideRight',
                        }}
                        tickFormatter={(value) => `$${value.toFixed(2)}M`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="AvgWAR"
                        stroke="#82ca9d"
                        name="Average WAR"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="AvgSalary"
                        stroke="#8884d8"
                        name="Average Salary (M)"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CostOfWAR;