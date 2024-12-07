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

    @GetMapping("/available-years")
    public List<Integer> getAvailableYears() {
        String sql = "SELECT DISTINCT SeasonYear FROM Season ORDER BY SeasonYear";
        return jdbcTemplate.queryForList(sql, Integer.class);
    }

    @GetMapping("/test-players")
    public List<Map<String, Object>> getTestPlayers() {
        String sql = "SELECT PlayerID, Position, Name FROM Player FETCH FIRST 10 ROWS ONLY";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Endpoint to fetch a list of all players.
     * @return A list of maps containing PlayerID and PlayerName.
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
     * @param playerId   ID of the player.
     * @param seasonYear Season year to analyze.
     * @return List of maps containing time period, total WAR, and cumulative WAR.
     */
    @GetMapping("/player-war-trend")
    public List<Map<String, Object>> getPlayerWarTrend(
            @RequestParam("playerId") int playerId,
            @RequestParam("seasonYear") int seasonYear) {

        String sql = """
            SELECT
                TRUNC(g.GameDate, 'MM') AS TimePeriod,       -- Group by month
                SUM(pg.WAR) AS TotalWARInHighStakes,         -- Total WAR for high-stakes games in that month
                SUM(SUM(pg.WAR)) OVER (ORDER BY TRUNC(g.GameDate, 'MM')) AS CumulativeWAR
            FROM
                PlayerGame pg
            JOIN 
                Game g ON pg.GameID = g.GameID               -- Match games to player performances
            JOIN 
                PlayerSeason ps ON pg.PlayerID = ps.PlayerID -- Link player season details
            WHERE 
                ps.PlayerID = ?                              -- Filter for the selected player
                AND ps.SeasonYear = ?                        -- Filter for the selected season
                AND (                                        -- High-stakes game criteria:
                    (g.HomeTeamID = ps.TeamID                -- If the player's team is the home team
                     AND g.HomeTeamStanding BETWEEN -3 AND 3)
                    OR
                    (g.AwayTeamID = ps.TeamID                -- If the player's team is the away team
                     AND g.AwayTeamStanding BETWEEN -3 AND 3)
                )
            GROUP BY 
                TRUNC(g.GameDate, 'MM')                      -- Group results by month
            ORDER BY 
                TimePeriod;                                  -- Order results by month
        """;

        // Execute the query and return results
        return jdbcTemplate.queryForList(sql, playerId, seasonYear);
    }
}