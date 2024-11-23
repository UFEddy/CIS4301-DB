import React, { useState } from 'react';
import {
    ComposedChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter
} from 'recharts';

function CostOfWAR() {
    // Sample league data: Replace with real data
    const leagueData = [
        { season: '2021', totalSalary: 3000, totalWAR: 900, avgSalary: 3.5, avgWAR: 1.05 },
        { season: '2022', totalSalary: 3500, totalWAR: 950, avgSalary: 4.0, avgWAR: 1.10 },
        { season: '2023', totalSalary: 4000, totalWAR: 1000, avgSalary: 4.2, avgWAR: 1.15 },
    ];

    // Sample player data: Replace with real data
    const playerData = [
        { player: 'Mike Trout', team: 'Angels', salary: 37, war: 9, season: '2021' },
        { player: 'Aaron Judge', team: 'Yankees', salary: 40, war: 10, season: '2022' },
        { player: 'Max Scherzer', team: 'Mets', salary: 43, war: 6, season: '2023' },
        { player: 'Freddie Freeman', team: 'Dodgers', salary: 30, war: 7, season: '2023' },
        { player: 'Shohei Ohtani', team: 'Angels', salary: 35, war: 9, season: '2021' },
    ];

    // Sample team success data: Replace with real data
    const teamData = [
        { team: 'Dodgers', totalSalary: 250, totalWAR: 50, wins: 111, season: '2021' },
        { team: 'Yankees', totalSalary: 240, totalWAR: 48, wins: 99, season: '2022' },
        { team: 'Angels', totalSalary: 200, totalWAR: 40, wins: 85, season: '2023' },
    ];

    // State for interactivity
    const [filterRange, setFilterRange] = useState([2021, 2023]);
    const [searchPlayer, setSearchPlayer] = useState('');

    // Filtered data
    const filteredLeagueData = leagueData.filter(
        (d) => parseInt(d.season) >= filterRange[0] && parseInt(d.season) <= filterRange[1]
    );

    const filteredPlayers = playerData.filter(
        (p) =>
            p.player.toLowerCase().includes(searchPlayer.toLowerCase()) &&
            parseInt(p.season) >= filterRange[0] &&
            parseInt(p.season) <= filterRange[1]
    );

    const filteredTeams = teamData.filter(
        (t) => parseInt(t.season) >= filterRange[0] && parseInt(t.season) <= filterRange[1]
    );
    // Calculate cost per WAR for each year
    leagueData.forEach((item) => {
        item.avgCostPerWAR = item.avgSalary / item.avgWAR; // Average cost per WAR
        item.totalCostPerWAR = item.totalSalary / item.totalWAR; // Total cost per WAR
    });

    // Summary Calculations
    const firstYear = filteredLeagueData[0];
    const lastYear = filteredLeagueData[filteredLeagueData.length - 1];

    const avgCostChange = lastYear.avgCostPerWAR - firstYear.avgCostPerWAR;
    const avgWARChange = lastYear.avgWAR - firstYear.avgWAR;
    const avgValueChange = avgCostChange / avgWARChange;

    const totalCostChange = lastYear.totalCostPerWAR - firstYear.totalCostPerWAR;
    const totalWARChange = lastYear.totalWAR - firstYear.totalWAR;
    const totalValueChange = totalCostChange / totalWARChange;

    const summary = (
        <p>
            The average cost to buy a single WAR has changed from{' '}
            <strong>${firstYear.avgCostPerWAR.toFixed(2)}M</strong> to{' '}
            <strong>${lastYear.avgCostPerWAR.toFixed(2)}M</strong>, while the average production of WAR
            has changed from <strong>{firstYear.avgWAR.toFixed(2)}</strong> to{' '}
            <strong>{lastYear.avgWAR.toFixed(2)}</strong>, creating a value change of{' '}
            <strong>${avgValueChange.toFixed(2)}M per WAR</strong>.<br />
            For the overall league-wide production, the cost to buy a single WAR has changed from{' '}
            <strong>${firstYear.totalCostPerWAR.toFixed(2)}M</strong> to{' '}
            <strong>${lastYear.totalCostPerWAR.toFixed(2)}M</strong>, while the total WAR production has
            changed from <strong>{firstYear.totalWAR}</strong> to{' '}
            <strong>{lastYear.totalWAR}</strong>, creating a value change of{' '}
            <strong>${totalValueChange.toFixed(2)}M per WAR</strong>.
        </p>
    );
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Cost of WAR Over Time</h1>
            <p>
                This page analyzes the cost of player performance in MLB, measured in
                Wins Above Replacement (WAR). It tracks changes in the average and total
                cost per WAR over time, offering insights into spending efficiency and
                the economics of team-building.
            </p>

            {/* Interactive Filters */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Filter by Season Range:{' '}
                    <select
                        value={filterRange[0]}
                        onChange={(e) => setFilterRange([parseInt(e.target.value), filterRange[1]])}
                    >
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                    {' - '}
                    <select
                        value={filterRange[1]}
                        onChange={(e) => setFilterRange([filterRange[0], parseInt(e.target.value)])}
                    >
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                </label>
            </div>

            {/* Chart: Average Salary vs. Average WAR */}
            <ResponsiveContainer width="90%" height={400}>
                <ComposedChart data={filteredLeagueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" label={{ value: 'Season', position: 'insideBottom', offset: -5 }} />
                    <YAxis
                        yAxisId="left"
                        label={{ value: 'Average WAR', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => value.toFixed(2)}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Average Salary (M)', angle: -90, position: 'insideRight' }}
                        tickFormatter={(value) => `$${value.toFixed(2)}M`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgWAR"
                        stroke="#82ca9d"
                        name="Average WAR"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgSalary"
                        stroke="#8884d8"
                        name="Average Salary (M)"
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Player Search */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3>Search for Players</h3>
                <input
                    type="text"
                    placeholder="Enter player name"
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                />
                <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
                    {filteredPlayers.map((player, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>{player.player}</strong> - Team: {player.team}, Salary: ${player.salary}M,
                            WAR: {player.war}, Season: {player.season}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Team Success Table */}
            <div style={{ marginTop: '20px' }}>
                <h3>Team Success Metrics</h3>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                    <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Team</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Salary (M)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total WAR</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Wins</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Season</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTeams.map((team, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.team}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${team.totalSalary}M</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.totalWAR}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.wins}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{team.season}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Chart: Team Spending Efficiency */}
            <ResponsiveContainer width="90%" height={400}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="salary" name="Salary (M)" unit="M" />
                    <YAxis dataKey="war" name="WAR" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter name="Players" data={playerData} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>

            {/* Summary Section */}
            <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left', padding: '0 10%' }}>
                <h3>Summary</h3>
                {summary}

                {/* Downloadable Report */}
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => {
                            const csvData = filteredLeagueData.map((row) =>
                                `${row.season},${row.totalSalary},${row.totalWAR},${row.avgSalary},${row.avgWAR},${row.totalCostPerWAR},${row.avgCostPerWAR}`
                            );
                            const csvHeader =
                                'Season,Total Salary (M),Total WAR,Average Salary (M),Average WAR,Total Cost per WAR,Average Cost per WAR';
                            const blob = new Blob([`${csvHeader}\n${csvData.join('\n')}`], {
                                type: 'text/csv',
                            });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = 'CostOfWAR.csv';
                            link.click();
                        }}
                    >
                        Download Report as CSV
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CostOfWAR;