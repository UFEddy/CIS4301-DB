import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

function formatDate(tick) {
    const date = new Date(tick);
    return date.getFullYear();
}

function QueryPositionCostTrend( {data}) {
    return (
        <div style = {{ textAlign: 'center', padding: '20px'}} >
            <h2>Query 1 Position Cost Trend Analysis</h2>
            <p>
                Evaluates how the cost of buying wins has changed over time for certain player positions. 
                The goal is to find trends in how much teams are willing to pay for wins, which will give 
                insight into which positions the industry has increasingly valued over time. 
                The query pulls data from main entities: Players, Contracts, WAR Statistics, and Positions. 
                The screen can be seen on Figure 5 and includes the same user inputs from the first screen 
                but also adds in the option for the user to select the position they want to look at.
                The data will be grouped by player positions and the average cost per WAR for each position. By examining this data over various seasons, 
                the query will show how the cost to buy wins has evolved for different positions. 
                This insight will help determine whether certain positions have become more expensive to fill with high-WAR players.
            </p>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data = {data} margin= {{ top: 20, right:30, left: 20, bottom: 20}} >
                    <XAxis 
                        dataKey="date"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                        tickFormatter={formatDate}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="Pitcher" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Catcher" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Infielder" stroke="#ffc658" />
                    <Line type="monotone" dataKey="Outfielder" stroke="#ff7300" />
                </LineChart>        
            </ResponsiveContainer>
        </div>
    )
}
export default QueryPositionCostTrend;