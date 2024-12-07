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
        try {
            String sql =
                    "WITH TeamSeasonWAR AS ( " +
                    "    SELECT " +
                    "        ps.TeamID, " +
                    "        ps.SeasonYear, " +
                    "        AVG(ps.WAR) AS AvgTeamWAR " +
                    "    FROM " +
                    "        PlayerSeason ps " +
                    "    GROUP BY " +
                    "        ps.TeamID, ps.SeasonYear " +
                    "), " +
                    "GameAttendancePerWAR AS ( " +
                    "    SELECT " +
                    "        g.SeasonYear, " +
                    "        t.TeamName, " +
                    "        g.GameDate, " +
                    "        g.Attendance, " +
                    "        tsw.AvgTeamWAR, " +
                    "        CASE " +
                    "            WHEN tsw.AvgTeamWAR > 0 THEN g.Attendance / tsw.AvgTeamWAR " +
                    "            ELSE 0 " +
                    "        END AS AttendancePerWAR " +
                    "    FROM " +
                    "        Game g " +
                    "    JOIN " +
                    "        TeamSeasonWAR tsw ON g.SeasonYear = tsw.SeasonYear " +
                    "                        AND (g.HomeTeamID = tsw.TeamID OR g.AwayTeamID = tsw.TeamID) " +
                    "    JOIN " +
                    "        Team t ON tsw.TeamID = t.TeamID " +
                    ") " +
                    "SELECT " +
                    "    SeasonYear AS Year, " +
                    "    TeamName, " +
                    "    TO_CHAR(GameDate, 'YYYY-MM-DD') AS GameDate, " +
                    "    Attendance, " +
                    "    AvgTeamWAR, " +
                    "    AttendancePerWAR " +
                    "FROM " +
                    "    GameAttendancePerWAR " +
                    "ORDER BY " +
                    "    SeasonYear, TeamName, GameDate";

            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            System.err.println("Error with query 3: " + e.getMessage());
            throw new RuntimeException("Failed to execute query3");
        }
    }
}
