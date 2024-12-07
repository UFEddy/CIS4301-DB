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

        /* The average Wins Above Replacement (WAR) for players, grouped by month
            and categorized as either Home or Away games, for a specified season year.
             TO_CHAR function to extract the month and year in "YYYY-MM" format from the game date,
             results grouped by month.
             A CASE statement determines whether the game is classified as "Home" or "Away" based on whether
            the player's team matches the home or away team in the game.
            The query joins three tables:
                - PlayerGame (containing individual player statistics),
                - Game (providing game metadata like date and teams),
                - PlayerSeason (linking players to their team and season).
                It filters games by the given season year, groups the results by month and game type,
                and computes the average WAR for each group.
            Results are ordered chronologically by month and by game type
         */

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