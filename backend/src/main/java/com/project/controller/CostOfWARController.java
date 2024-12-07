package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CostOfWARController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CostOfWARController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Endpoint to fetch aggregated league data.
     * This query aggregates league-wide performance metrics for each season.
     * It calculates:
     * - Total salary for all players in the league (SUM(ps.Salary))
     * - Total WAR for all players in the league (SUM(ps.WAR))
     * - Average salary for players (AVG(ps.Salary))
     * - Average WAR for players (AVG(ps.WAR))
     * The results are grouped by season year (ps.SeasonYear) to show metrics on a per-season basis.
     * The query is ordered by season year to ensure chronological output.
     *
     * @return List of league data with total salary, total WAR, average salary, and average WAR per season.
     */
    @GetMapping("/league-data")
    public List<Map<String, Object>> getLeagueData() {
        String sql =
                "SELECT " +
                        "   ps.SeasonYear AS Season, " +             // Select the season year.
                        "   SUM(ps.Salary) AS TotalSalary, " +       // Calculate the total salary for the season.
                        "   SUM(ps.WAR) AS TotalWAR, " +             // Calculate the total WAR for the season.
                        "   AVG(ps.Salary) AS AvgSalary, " +         // Calculate the average salary for the season.
                        "   AVG(ps.WAR) AS AvgWAR " +                // Calculate the average WAR for the season.
                        "FROM " +
                        "   PlayerSeason ps " +                      // From the PlayerSeason table.
                        "GROUP BY " +
                        "   ps.SeasonYear " +                        // Group results by season year.
                        "ORDER BY " +
                        "   ps.SeasonYear";                          // Order the results by season year.
        return jdbcTemplate.queryForList(sql);
    }
}