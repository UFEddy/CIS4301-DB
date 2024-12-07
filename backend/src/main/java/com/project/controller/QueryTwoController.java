package com.project.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class QueryTwoController {
    private final JdbcTemplate jdbcTemplate;

    public QueryTwoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/query2")
    public List<Map<String, Object>> getQuery2Results(@RequestBody Map<String, String> request) {
        String seasonYear = request.get("seasonYear");

        String query = "SELECT " +
                "    TO_CHAR(g.GameDate, 'YYYY-MM') AS Month, " +
                "    CASE " +
                "        WHEN g.HomeTeamID = ps.TeamID THEN 'Home' " +
                "        WHEN g.AwayTeamID = ps.TeamID THEN 'Away' " +
                "    END AS GameType, " +
                "    AVG(pg.WAR) AS AverageWAR " +
                "FROM " +
                "    PlayerGame pg " +
                "JOIN " +
                "    Game g ON pg.GameID = g.GameID " +
                "JOIN " +
                "    PlayerSeason ps ON pg.PlayerID = ps.PlayerID " +
                "    AND g.SeasonYear = ps.SeasonYear " +
                "WHERE " +
                "    g.SeasonYear = ? " +
                "GROUP BY " +
                "    TO_CHAR(g.GameDate, 'YYYY-MM'), " +
                "    CASE " +
                "        WHEN g.HomeTeamID = ps.TeamID THEN 'Home' " +
                "        WHEN g.AwayTeamID = ps.TeamID THEN 'Away' " +
                "    END " +
                "ORDER BY " +
                "    TO_CHAR(g.GameDate, 'YYYY-MM'), GameType";
        return jdbcTemplate.queryForList(query, seasonYear);
    }
}