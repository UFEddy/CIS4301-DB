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
public class QueryOneController {
    private final JdbcTemplate jdbcTemplate;

    public QueryOneController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/query1")
    public List<Map<String, Object>> queryOne() {
        String  sql =
                "SELECT " +
                "    ps.SeasonYear AS Year, " +
                "    p.Position, " +
                "    AVG(ps.Salary) AS AverageSalary " +
                "FROM PlayerSeason ps " +
                "JOIN Player p ON ps.PlayerID = p.PlayerID " +
                "GROUP BY ps.SeasonYear, p.Position " +
                "ORDER BY ps.SeasonYear, p.Position";

        return jdbcTemplate.queryForList(sql);
    }
}
