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

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                // Get the JWT token from localStorage
                const token = localStorage.getItem("jwt"); // The actual token string stored in localStorage

                // Ensure the token is present before making the request
                // if (!token) {
                //     throw new Error("Authentication token is missing. Please log in.");
                // }

                // Make the API request to fetch players
                const response = await fetch("http://localhost:8080/api/players", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                        "Content-Type": "application/json", // Explicitly set the content type
                    },
                });

                // Check for response status
                if (!response.ok) {
                    throw new Error(`Failed to fetch players. Status: ${response.status}`);
                }

                // Parse the JSON response
                const data = await response.json();
                setPlayers(data); // Update the players state
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching players:", err.message);
                setError(err.message || "Failed to load players."); // Set error message
            }
        };

        fetchPlayers(); // Call the function on component mount
    }, []); // Empty dependency array ensures it runs only once

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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Player Performance vs. Team Standing</h2>
            <p>
                Analyze the relationship between individual player performance and team
                standings throughout a baseball season. Discover trends that reveal how
                players excel in high-pressure scenarios.
            </p>

            {/* Player and Year Dropdowns */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Select Player:{" "}
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                    >
                        <option value="">-- Select a Player --</option>
                        {players.length > 0 ? (
                            players.map((player) => (
                                <option key={player.PlayerID} value={player.PlayerID}>
                                    {player.PlayerName}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading players...</option>
                        )}
                    </select>
                </label>
                <label style={{marginLeft: "20px"}}>
                    Select Year:{" "}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">-- Select a Year --</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Chart */}
            <div style={{marginTop: "20px"}}>
                {loading ? (
                    <p>Loading data...</p>
                ) : error ? (
                    <p style={{color: "red"}}>{error}</p>
                ) : performanceData.length > 0 ? (
                    <ResponsiveContainer width="90%" height={400}>
                    <ComposedChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="TimePeriod"
                                label={{ value: "Time Period (Month)", position: "insideBottom", offset: -5 }}
                            />
                            <YAxis
                                label={{
                                    value: "WAR",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="TotalWARInHighStakes"
                                fill="#8884d8"
                                name="WAR per Time Period"
                            />
                            <Line
                                type="monotone"
                                dataKey="CumulativeWAR"
                                stroke="#82ca9d"
                                name="Cumulative WAR"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    selectedPlayer && <p>No data available for this player and year.</p>
                )}
            </div>
        </div>
    );
}

export default PlayerPerformanceVSTeamStanding;