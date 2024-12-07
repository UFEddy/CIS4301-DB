import React, { useState, useEffect } from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function PlayerPerformanceVSTeamStanding() {
    // States for dropdowns and data
    const [players, setPlayers] = useState([]); // Player dropdown options
    const [selectedPlayer, setSelectedPlayer] = useState(""); // Selected player ID
    const [selectedYear, setSelectedYear] = useState("2021"); // Default season year
    const [performanceData, setPerformanceData] = useState([]); // Data for the chart
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [availableYears, setAvailableYears] = useState([]); // Available years for dropdown
    const [teams, setTeams] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("");

    const fetchPlayers = async () => {
        try {
            // Retrieve the JWT token from localStorage to authenticate the request
            const token = localStorage.getItem("jwt");

            // Create an object to hold query parameters
            const queryParams = new URLSearchParams();

            // If a team is selected, add the teamId as a query parameter
            if (selectedTeam) queryParams.append("teamId", selectedTeam);

            // If a season is selected, add the seasonYear as a query parameter
            if (selectedSeason) queryParams.append("seasonYear", selectedSeason);

            // Send a GET request to the API with the query parameters and authorization header
            const response = await fetch(
                `http://localhost:8080/api/players?${queryParams.toString()}`, // Constructed URL with query parameters
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                    },
                }
            );

            // Check if the response status is not OK (e.g., 404, 500)
            if (!response.ok) {
                throw new Error(`Failed to fetch players: ${response.status}`);
            }

            // Parse the response JSON to get the player data
            const data = await response.json();

            // Transform keys to match expected format
            const formattedData = data.map((player) => ({
                PlayerID: player.PLAYERID, // Transform PLAYERID to PlayerID
                PlayerName: player.PLAYERNAME, // Transform PLAYERNAME to PlayerName
            }));

            setPlayers(formattedData); // Update state with formatted data

        } catch (error) {
            // Log the error to the console for debugging
            console.error("Error fetching players:", error);
        }
    };

    const fetchFilters = async () => {
        try {
            const token = localStorage.getItem("jwt");

            // Fetch Teams
            const teamResponse = await fetch("http://localhost:8080/api/allTeams", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const teamsData = await teamResponse.json();
            // Transform team keys to match the expected format
            const formattedTeams = teamsData.map((team) => ({
                TeamID: team.TEAMID, // Transform TEAMID to TeamID
                TeamName: team.TEAMNAME, // Transform TEAMNAME to TeamName
            }));
            setTeams(formattedTeams); // Update state with formatted data

            // Fetch Seasons
            const seasonResponse = await fetch("http://localhost:8080/api/seasons", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const seasonsData = await seasonResponse.json();
            setSeasons(seasonsData);
        } catch (error) {
            console.error("Error fetching filters:", error);
        }
    };


    useEffect(() => {
        const fetchAvailableYears = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/available-years");
                const data = await response.json();
                setAvailableYears(data);
            } catch (err) {
                console.error("Error fetching available years:", err);
                setError("Failed to load available years.");
            }
        };
        fetchAvailableYears();
    }, []);


    // Fetch filters on component mount
    useEffect(() => {
        fetchFilters();
    }, []);

    // Fetch players when filters change
    useEffect(() => {
        fetchPlayers();
    }, [selectedTeam, selectedSeason]);

    // Fetch performance data whenever player or season changes
    useEffect(() => {
        if (selectedPlayer && selectedYear) {
            const fetchPerformanceData = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(
                        `http://localhost:8080/api/player-war-trend?playerId=${selectedPlayer}&seasonYear=${selectedYear}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                // "Authorization": `Bearer ${jwt}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch performance data.");
                    }

                    const data = await response.json();
                    setPerformanceData(data);
                } catch (err) {
                    console.error("Error fetching performance data:", err);
                    setError("Failed to load performance data. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };
            fetchPerformanceData();
        }
    }, [selectedPlayer, selectedYear]);

    return (
        <div style={{textAlign: "center", padding: "20px"}}>
            {/* Title of the section */}
            <h2>Player Performance vs. Team Standing</h2>

            {/* Brief description of the chart */}
            <p>
                Analyze the relationship between individual player performance and team
                standings throughout a season. These trends reveal how players excel in
                high-pressure scenarios.
            </p>

            <div>
                {/* Title for the filters section */}
                <h2>Filter Players</h2>

                {/* Dropdown to filter players by team */}
                <label>
                    Select Team:
                    <select
                        value={selectedTeam} // The current selected team value from state
                        onChange={(e) => setSelectedTeam(e.target.value)} // Update the selectedTeam state on change
                    >
                        {/* Default option to select all teams */}
                        <option value="">-- All Teams --</option>

                        {/* Dynamically render team options */}
                        {teams.map((team) => (
                            <option key={team.TeamID} value={team.TeamID}>
                                {team.TeamName} {/* Display team name */}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Dropdown to filter players by season */}
                <label>
                    Select Season:
                    <select
                        value={selectedSeason} // The current selected season value from state
                        onChange={(e) => setSelectedSeason(e.target.value)} // Update the selectedSeason state on change
                    >
                        {/* Default option to select all seasons */}
                        <option value="">-- All Seasons --</option>

                        {/* Dynamically render season options */}
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season} {/* Display season year */}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Dropdown to select a player */}
                <label>
                    Select Player:
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        disabled={!selectedTeam || !selectedSeason} // Disable dropdown if prerequisites aren't met
                    >
                        <option value="">-- Select a Player --</option>
                        {players.length > 0 ? (
                            players.map((player) => (
                                <option key={player.PlayerID} value={player.PlayerID}>
                                    {player.PlayerName}
                                </option>
                            ))
                        ) : (
                            <option disabled>No players available</option>
                        )}
                    </select>
                </label>
            </div>

            {/* Chart section */}
            <div style={{marginTop: "20px"}}>
                {loading ? (
                    // Show loading message while data is being fetched
                    <p>Loading data...</p>
                ) : error ? (
                    // Show error message if an error occurs during data fetching
                    <p style={{color: "red"}}>{error}</p>
                ) : performanceData.length > 0 ? (
                    // Render the chart if there is performance data
                    <ResponsiveContainer width="90%" height={400}>
                        <ComposedChart data={performanceData}>
                            {/* Add grid lines to the chart */}
                            <CartesianGrid strokeDasharray="3 3"/>

                            {/* Configure the X-axis */}
                            <XAxis
                                dataKey="TimePeriod" // Map X-axis to the "TimePeriod" field in the data
                                label={{value: "Time Period (Month)", position: "insideBottom", offset: -5}}
                            />

                            {/* Configure the Y-axis */}
                            <YAxis
                                label={{
                                    value: "WAR", // Label for Y-axis
                                    angle: -90, // Rotate the label
                                    position: "insideLeft", // Position label on the left of the axis
                                }}
                            />

                            {/* Add a tooltip to show data on hover */}
                            <Tooltip/>

                            {/* Add a legend to identify the chart elements */}
                            <Legend/>

                            {/* Add bar chart for WAR per time period */}
                            <Bar
                                dataKey="TotalWARInHighStakes" // Map data to "TotalWARInHighStakes"
                                fill="#8884d8" // Bar color
                                name="WAR per Time Period" // Name for legend and tooltip
                            />

                            {/* Add line chart for cumulative WAR */}
                            <Line
                                type="monotone" // Smooth line type
                                dataKey="CumulativeWAR" // Map data to "CumulativeWAR"
                                stroke="#82ca9d" // Line color
                                name="Cumulative WAR" // Name for legend and tooltip
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    // Show message if no data is available for the selected filters
                    selectedPlayer && <p>No data available for this player and year.</p>
                )}
            </div>
        </div>
    );
}

export default PlayerPerformanceVSTeamStanding;