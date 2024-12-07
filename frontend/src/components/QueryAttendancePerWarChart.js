import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

function transformData(data) {
    const dataMap = {};
    const teams = new Set();

    data.forEach(row => {
        const year = row.Year;
        const team = row.TeamName;
        const value = row.AttendancePerWAR;

        teams.add(team);

        if(!dataMap[year]) {
            dataMap[year] = { Year: year };
        }
        dataMap[year][team] = value;
    });
    return { transformed: Object.values(dataMap), teams: [...teams] };
}

function QueryAttendancePerWarChart() {
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/query3')
            .then(response => {
                if(!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const { transformed, teams } = transformData(data);
                setChartData(transformed);
                setTeams(teams);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }} >
            <h2>Query 3 Attendance Per WAR Analysis</h2>
                <p>
                    The following complex query aims to analyze games and deduce whether large ticket sales is due 
                    to a particularly skillful team/player influencing high ticket sales or if large attendance 
                    incites great player performance. Our query will take in metrics such as batting average (AVG), 
                    runs batted in(RBI), home runs (HR), wins above replacement (WAR), and more, to assist in our 
                    tracking. This query will be tracked over a period of time to give further insight to trending 
                    data, and allow us to notate how our findings have changed over the years. The gathered 
                    information is important to review and analyze, for the consumer and the team, to answer 
                    the following questions: How has consumerism surrounding players in live sports changed 
                    over the years? Has the progression and implementation of technology helped or hindered 
                    the major league sports industry? Do players' performance affect the number of tickets 
                    sold as much as they have in the past? Answering these questions' is important to assist 
                    leading the major sports industry into a relationship where consumer and franchise can 
                    enjoy and reap the rewards that both parties aim to achieve.
                </p>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="Year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />

                        {/* Add lines for each team dynamically */}
                        {teams.map(team =>  (
                            <Line
                            key={team}
                            type="monotone"
                            dataKey={team}
                            stroke="#8884d8"
                            dot={false}
                            activeDot={{ r: 5 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
    );
}
export default QueryAttendancePerWarChart;