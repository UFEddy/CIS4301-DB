package com.project.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayerPerformanceController {

    private final JdbcTemplate jdbcTemplate;

    public PlayerPerformanceController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    /**
     * Endpoint to fetch available years.
     * This query retrieves all unique season years from the Season table.
     * It uses DISTINCT to ensure no duplicate years are returned and orders them chronologically.
     * @return List of available years in ascending order.
     */
    @GetMapping("/available-years")
    public List<Integer> getAvailableYears() {
        String sql = "SELECT DISTINCT SeasonYear FROM Season ORDER BY SeasonYear";
        return jdbcTemplate.queryForList(sql, Integer.class);
    }

    /**
     * Endpoint to fetch a test list of players.
     * This query selects the first 10 players from the Player table.
     * It retrieves PlayerID, Position, and Name, sorted by default table order.
     * This is useful for quick validation or testing.
     * @return List of the first 10 players with basic details.
     */
    @GetMapping("/test-players")
    public List<Map<String, Object>> getTestPlayers() {
        String sql = "SELECT PlayerID, Position, Name FROM Player FETCH FIRST 10 ROWS ONLY";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Endpoint to fetch a list of all players.
     * This query retrieves all players from the Player table.
     * It selects PlayerID and Name (aliased as PlayerName) and sorts the results alphabetically by name.
     * @return List of all players with their IDs and names.
     */
    @GetMapping("/players")
    public List<Map<String, Object>> getAllPlayers() {
        String sql =
                " SELECT " +
                        "   PlayerID," +
                        "   Name AS PlayerName " +
                        " FROM " +
                        "   Player "+
                        " ORDER BY Name";

        try {
            List<Map<String, Object>> players = jdbcTemplate.queryForList(sql);
            System.out.println("Fetched Players: " + players);
            return players;
        } catch (Exception e) {
            System.err.println("Error fetching players: " + e.getMessage());
            throw e; // To see detailed error in logs
        }
    }

    /**
     * Endpoint to fetch all teams.
     * This query retrieves all teams from the Team table.
     * It selects TeamID and TeamName, sorting the results alphabetically by TeamName.
     * @return List of all teams with their IDs and names.
     */
    @GetMapping("/allTeams")
    public List<Map<String, Object>> getTeams() {
        String sql =
                " SELECT " +
                        "   TeamID, " +
                        "   TEAMNAME " +
                        " FROM " +
                        "   Team " +
                        " ORDER BY TEAMNAME ";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Endpoint to fetch all seasons with player data.
     * This query retrieves all distinct season years from the PlayerSeason table.
     * It ensures that only seasons with player data are returned and orders them chronologically.
     * @return List of distinct season years in ascending order.
     */
    @GetMapping("/seasons")
    public List<Integer> getSeasons() {
        String sql =
                " SELECT DISTINCT " +
                        "   SeasonYear " +
                        " FROM " +
                        "   PlayerSeason " +
                        " ORDER BY SeasonYear";
        return jdbcTemplate.queryForList(sql, Integer.class);
    }

    /**
     * Endpoint to fetch the total number of players in the Player table.
     * This query counts all rows in the Player table and returns the result as a single integer.
     * It is useful for quickly determining the size of the Player table.
     * @return JSON object containing the total row count of the Player table.
     */
    @GetMapping("/player")
    public Map<String, Object> getRowCount() {
        String sql = "SELECT COUNT(*) FROM PLAYER";
        Integer totalRows = jdbcTemplate.queryForObject(sql, Integer.class);

        // Return JSON
        Map<String, Object> response = new HashMap<>();
        response.put("total_rows", totalRows == null ? 0 : totalRows);
        return response;
    }


    /**
     * Endpoint to fetch WAR trend for a specific player and season.
     * This query calculates WAR trends for a player during high-stakes games in a given season.
     * It retrieves:
     *   - The month of the game (TRUNC(g.GameDate, 'MM') as TimePeriod)
     *   - Total WAR for high-stakes games in that month (SUM(pg.WAR))
     *   - Cumulative WAR up to that month (SUM(SUM(pg.WAR)) OVER (ORDER BY TRUNC(g.GameDate, 'MM')))
     * The query joins:
     *   - PlayerGame (pg) with Game (g) to link player stats to games
     *   - PlayerSeason (ps) with PlayerGame (pg) to filter by the player's team and season
     * High-stakes games are defined based on team standings being within -3 to 3.
     * Results are grouped by month and ordered chronologically.
     * @param playerId   ID of the player to analyze.
     * @param seasonYear The season year to filter by.
     * @return List of WAR trends with time period, total WAR, and cumulative WAR.
     */
    @GetMapping("/player-war-trend")
    public List<Map<String, Object>> getPlayerWarTrend(
            @RequestParam("playerId") int playerId,
            @RequestParam("seasonYear") int seasonYear) {

        String sql =
                "SELECT " +
                    "   TRUNC(g.GameDate, 'MM') AS TimePeriod, " +       // Group by month
                    "   SUM(pg.WAR) AS TotalWARInHighStakes, " +         // Total WAR for high-stakes games in that month
                    "   SUM(SUM(pg.WAR)) OVER (ORDER BY TRUNC(g.GameDate, 'MM')) AS CumulativeWAR " +
                "FROM " +
                    "   PlayerGame pg " +
                "JOIN " +
                    "   Game g ON pg.GameID = g.GameID " +               // Match games to player performances
                "JOIN " +
                    "   PlayerSeason ps ON pg.PlayerID = ps.PlayerID " + // Link player season details
                "WHERE " +
                    "   ps.PlayerID = ? " +                              // Filter for the selected player
                    "   AND ps.SeasonYear = ? " +                        // Filter for the selected season
                    "   AND ( " +                                        // High-stakes game criteria:
                    "       (g.HomeTeamID = ps.TeamID " +                // If the player's team is the home team
                    "        AND g.HomeTeamStanding BETWEEN -3 AND 3) " +
                    "       OR " +
                    "       (g.AwayTeamID = ps.TeamID " +                // If the player's team is the away team
                    "        AND g.AwayTeamStanding BETWEEN -3 AND 3) " +
                    "   ) " +
                "GROUP BY " +
                    "   TRUNC(g.GameDate, 'MM') " +                      // Group results by month
                "ORDER BY " +
                    "   TimePeriod;";                                    // Order results by month

        // Execute the query and return results
        return jdbcTemplate.queryForList(sql, playerId, seasonYear);
    }
}