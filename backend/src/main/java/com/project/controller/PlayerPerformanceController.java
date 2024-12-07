package com.project.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayerPerformanceController {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    // Constructor for dependency injection
    @Autowired
    public PlayerPerformanceController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
    }


    /**
     * Endpoint to fetch a list of all players.
     * This query retrieves all players from the Player table.
     * It selects PlayerID and Name (aliased as PlayerName) and sorts the results alphabetically by name.
     * @param teamId     Optional team ID to filter players.
     * @param seasonYear Optional season year to filter players.
     * @return List of players matching the filters.
     */
    @GetMapping("/players")
    public List<Map<String, Object>> getPlayersByTeamAndSeason(
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) Integer seasonYear) {

        String sql = "SELECT " +
                "   p.PlayerID AS playerID, " +
                "   p.Name AS PlayerName " +
                "FROM " +
                "   PlayerSeason ps " +
                "JOIN " +
                "   Player p ON ps.PlayerID = p.PlayerID " +
                "WHERE " +
                "   (:teamId IS NULL OR ps.TeamID = :teamId) " +
                "   AND (:seasonYear IS NULL OR ps.SeasonYear = :seasonYear) " +
                "ORDER BY " +
                "   p.Name";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("teamId", teamId)
                .addValue("seasonYear", seasonYear);

        return namedParameterJdbcTemplate.queryForList(sql, params);
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
     *   - Cumulative WAR up to that month
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
                "WITH MonthlyWAR AS ( " + // Common Table Expression (CTE) to calculate WAR (Wins Above Replacement) by month
                        "    SELECT " +
                        "        TRUNC(g.GameDate, 'MM') AS TimePeriod,  " + // Truncate the game date to the first day of the month (e.g., 2021-04-01)
                        "        SUM(pg.WAR) AS TotalWARInHighStakes     " + // Sum of WAR values for high-stakes games within the month
                        "    FROM " +
                        "        PlayerGame pg " +                             // PlayerGame table, which contains WAR data per game
                        "    JOIN " +
                        "        Game g ON pg.GameID = g.GameID          " +    // Join with the Game table to link games to player performance
                        "    JOIN " +
                        "        PlayerSeason ps ON pg.PlayerID = ps.PlayerID " + // Join with PlayerSeason table to filter by player and season
                        "    WHERE " +
                        "        ps.PlayerID = :playerId                 " +    // Filter by the specified player ID
                        "        AND ps.SeasonYear = :seasonYear         " +    // Filter by the specified season year
                        "        AND ( " +
                        "            (g.HomeTeamID = ps.TeamID           " +        // Case where the player's team is the home team
                        "             AND g.HomeTeamStanding BETWEEN -3 AND 3) " + // High-stakes game defined as the home team's standing within -3 to 3
                        "            OR " +
                        "            (g.AwayTeamID = ps.TeamID           " +        // Case where the player's team is the away team
                        "             AND g.AwayTeamStanding BETWEEN -3 AND 3) " + // High-stakes game defined as the away team's standing within -3 to 3
                        "        ) " +
                        "    GROUP BY " +
                        "        TRUNC(g.GameDate, 'MM')                 " +        // Group results by month
                ") " +
                "SELECT " +
                "    mw1.TimePeriod,                             " +                   // The time period (month)
                "    mw1.TotalWARInHighStakes,                   " +                    // Total WAR for high-stakes games during this month
                "    NVL((SELECT " +
                "         SUM(mw2.TotalWARInHighStakes)          " +                    // Calculate cumulative WAR up to the current month
                "     FROM " +
                "         MonthlyWAR mw2                         " +                    // Use the CTE for cumulative calculation
                "     WHERE " +
                "         mw2.TimePeriod <= mw1.TimePeriod       " +                    // Include all previous months up to the current month
                "    ), 0) AS CumulativeWAR                      " +                    // Use NVL to ensure 0 is returned if no data is found
                "FROM " +
                "    MonthlyWAR mw1                              " +                    // Query the CTE for the current month
                "ORDER BY " +
                "    mw1.TimePeriod                             ";                      // Sort the final results chronologically by month

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("playerId", playerId);
        params.addValue("seasonYear", seasonYear);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.queryForList(sql, params);

        // Add logging to debug the query result
        System.out.println("Query Result: " + result);

        return result;
    }
}