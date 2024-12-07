package com.project.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class QueryThreeController {
    private final JdbcTemplate jdbcTemplate;

    public QueryThreeController(JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/query3")
    public List<Map<String, Object>> queryThree() {
        String  sql =
                "SELECT " +
                "    g.SeasonYear AS Year, " +
                "    ps.TeamID, " +
                "    t.TeamName, " +
                "    SUM(g.Attendance) AS TotalAttendance, " +
                "    SUM(pg.WAR) AS TotalWAR, "+
                "    CASE "+
                "       WHEN SUM(pg.WAR) > 0 THEN SUM(g.Attendance) / SUM(pg.WAR) " +
                "       ELSE NULL " +
                "   END AS AttendancePerWAR " +
                "FROM Game g " +
                "JOIN PlayerGame pg ON g.GameID = pg.GameID " +
                "JOIN PlayerSeason ps ON pg.PlayerID = ps.PlayerID  " +
                "   AND ps.TeamID IN (g.HomeTeamID, g.AwayTeamID)  " +
                "JOIN Team t ON t.TeamID = ps.TeamID " +
                "GROUP BY g.SeasonYear, ps.TeamID, t.TeamName " +
                "ORDER BY g.SeasonYear, t.TeamName";

        return jdbcTemplate.queryForList(sql);
    }
}
