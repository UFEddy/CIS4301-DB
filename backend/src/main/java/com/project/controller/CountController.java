package com.project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CountController {
    
    private final JdbcTemplate jdbcTemplate;

    public CountController(JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
        //this.jdbcTemplate.execute("BEGIN DBMS_STATS.GATHER_SCHEMA_STATS('\"EDDY.ROSALES\"'); END;");
    }


    @GetMapping("/count")
    public Map<String, Object> getRowCount() {
        String sql = "SELECT COUNT(*) FROM PLAYER";
        Integer totalRows = jdbcTemplate.queryForObject(sql, Integer.class);

        // Return JSON
        Map<String, Object> response = new HashMap<>();
        response.put("total_rows", totalRows == null ? 0 : totalRows);
        return response;
    }
}
