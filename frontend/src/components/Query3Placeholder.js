import React from 'react';

function Query3Placeholder() {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }} >
            <h2>Query 3</h2>
                <p>This query analyzes the relationship between individual player performance and the team's current standing within a baseball season. 
                    The goal is to determine whether players perform better when their team is leading the division, in the middle of the rankings, or 
                    in a wildcard race. The query uses data from main entities: Players, Statistics, Teams, and Seasons. By joining these entities,the 
                    query allows us to calculate the average performance metrics for each player, focusing on key statistics like home runs and runs batted in. (RBI).
                    The query groups player performance data based on the team's standing and calculates average statistics like home runs and runs batted in for each 
                    player. This will give us a deeper understanding of how individual performance changes over time when the stakes are higher, such as when a 
                    team is leading the division or fighting for a wildcard spot. By comparing these performance metrics, we can uncover patterns that 
                    suggest whether players excel under pressure or whether teams in lower standings show diminished performance due to lack of motivation. 
                    This insight can help identify trends that influence player performance throughout the season
                </p>
            </div>
    );
}
export default Query3Placeholder;