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
    // State variables for managing the data and user selections
    const [players, setPlayers] = useState([]); // List of players for the dropdown
    const [selectedPlayer, setSelectedPlayer] = useState(""); // Currently selected player ID
    const [selectedYear, setSelectedYear] = useState("2021"); // Default selected year
    const [performanceData, setPerformanceData] = useState([]); // Data for the chart
    const [loading, setLoading] = useState(false); // Loading state indicator
    const [error, setError] = useState(null); // Error state indicator
    const [availableYears, setAvailableYears] = useState([]); // Available years for selection
    const [teams, setTeams] = useState([]); // List of teams for filtering
    const [seasons, setSeasons] = useState([]); // List of seasons for filtering
    const [selectedTeam, setSelectedTeam] = useState(""); // Selected team ID
    const [selectedSeason, setSelectedSeason] = useState(""); // Selected season year

    /**
     * Fetches the list of players based on selected team and season.
     * Updates the `players` state with the retrieved data.
     */
    const fetchPlayers = async () => {
        try {
            const token = localStorage.getItem("jwt"); // JWT token for authentication
            const queryParams = new URLSearchParams(); // Helper for constructing query strings

            // Add team and season filters if selected
            if (selectedTeam) queryParams.append("teamId", selectedTeam);
            if (selectedSeason) queryParams.append("seasonYear", selectedSeason);

            // Fetch players from the API
            const response = await fetch(
                `http://localhost:8080/api/players?${queryParams.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }, // Include JWT in request headers
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch players: ${response.status}`);
            }

            const data = await response.json();

            // Format the data for use in the dropdown
            const formattedData = data.map((player) => ({
                PlayerID: player.PLAYERID,
                PlayerName: player.PLAYERNAME,
            }));

            setPlayers(formattedData); // Update state with formatted data
        } catch (error) {
            console.error("Error fetching players:", error); // Log errors for debugging
        }
    };

    /**
     * Fetches filter options for teams and seasons from the API.
     * Updates the `teams` and `seasons` state variables.
     */
    const fetchFilters = async () => {
        try {
            const token = localStorage.getItem("jwt");

            // Fetch teams data
            const teamResponse = await fetch("http://localhost:8080/api/allTeams", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const teamsData = await teamResponse.json();
            const formattedTeams = teamsData.map((team) => ({
                TeamID: team.TEAMID,
                TeamName: team.TEAMNAME,
            }));
            setTeams(formattedTeams);

            // Fetch seasons data
            const seasonResponse = await fetch("http://localhost:8080/api/seasons", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const seasonsData = await seasonResponse.json();
            setSeasons(seasonsData);
        } catch (error) {
            console.error("Error fetching filters:", error); // Log errors for debugging
        }
    };

    /**
     * Fetches available years for selection.
     * Updates the `availableYears` state variable.
     */
    useEffect(() => {
        const fetchAvailableYears = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/available-years");
                const data = await response.json();
                setAvailableYears(data); // Update state with available years
            } catch (err) {
                console.error("Error fetching available years:", err); // Log errors
                setError("Failed to load available years."); // Update error state
            }
        };
        fetchAvailableYears();
    }, []); // Empty dependency array ensures this runs only once on mount

     // Fetches filter options (teams and seasons) when the component mounts.
    useEffect(() => {
        fetchFilters(); // Load filters on initial render
    }, []);

    //Fetches players whenever the selected team or season changes.

    useEffect(() => {
        fetchPlayers(); // Load players when filters change
    }, [selectedTeam, selectedSeason]);

    //Fetches performance data whenever a player and year are selected.
    useEffect(() => {
        if (selectedPlayer && selectedYear) {
            const fetchPerformanceData = async () => {
                setLoading(true); // Show loading indicator
                setError(null); // Clear any previous errors

                try {
                    // Fetch performance data for the selected player and year
                    const response = await fetch(
                        `http://localhost:8080/api/player-war-trend?playerId=${selectedPlayer}&seasonYear=${selectedYear}`,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch performance data.");
                    }

                    const data = await response.json();

                    // Transform data for better readability
                    const transformedData = data.map((item) => {
                        const date = new Date(item.TIMEPERIOD); // Parse the TIMEPERIOD field
                        const monthNames = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December",
                        ];
                        const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`; // Format to "Month Year"
                        return {
                            TimePeriod: formattedDate,
                            TotalWARInHighStakes: item.TOTALWARINHIGHSTAKES,
                            CumulativeWAR: item.CUMULATIVEWAR,
                        };
                    });

                    console.log("Transformed Data:", transformedData); // Debug transformed data
                    setPerformanceData(transformedData); // Update state with chart data
                } catch (err) {
                    console.error("Error fetching performance data:", err); // Log errors
                    setError("Failed to load performance data. Please try again later."); // Update error state
                } finally {
                    setLoading(false); // Hide loading indicator
                }
            };
            fetchPerformanceData();
        }
    }, [selectedPlayer, selectedYear]); // Trigger whenever player or year changes


    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Player Performance vs. Team Standing</h2>
            <p>
                Analyze the relationship between individual player performance and team
                standings throughout a season.
            </p>

            <div>
                <h2>Filter Players</h2>
                <label>
                    Select Team:
                    <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        <option value="">-- All Teams --</option>
                        {teams.map((team) => (
                            <option key={team.TeamID} value={team.TeamID}>
                                {team.TeamName}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Select Season:
                    <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
                        <option value="">-- All Seasons --</option>
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Select Player:
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        disabled={!selectedTeam || !selectedSeason}
                    >
                        <option value="">-- Select a Player --</option>
                        {players.map((player) => (
                            <option key={player.PlayerID} value={player.PlayerID}>
                                {player.PlayerName}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div style={{ marginTop: "20px" }}>
                {loading ? (
                    <p>Loading data...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : performanceData.length > 0 ? (
                    <ResponsiveContainer width="90%" height={400}>
                        <ComposedChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="TimePeriod" label={{ value: "Time Period", position: "insideBottom", offset: -5 }} />
                            <YAxis label={{ value: "WAR", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="TotalWARInHighStakes" fill="#8884d8" name="WAR per Time Period" />
                            <Line type="monotone" dataKey="CumulativeWAR" stroke="#82ca9d" name="Cumulative WAR" />
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