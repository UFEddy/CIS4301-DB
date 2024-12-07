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
    }


    @GetMapping("/count")
    public Map<String, Object> getRowCount() {
        String sql = "SELECT SUM(num_rows) AS total_rows FROM all_tables WHERE owner = USER";
        Integer totalRows = jdbcTemplate.queryForObject(sql, Integer.class);

        // Return JSON
        Map<String, Object> response = new HashMap<>();
        response.put("total_rows", totalRows == null ? 0 : totalRows);
        return response;
    }
}
