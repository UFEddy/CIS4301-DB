package com.project.controller;

import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class DataController {
    public static void main(String[] args) {
        String query = "SELECT " +
                "    g.SeasonYear AS Year, " +
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
                "WHERE g.SeasonYear = '2023' " +
                "GROUP BY " +
                "    g.SeasonYear, " +
                "    CASE " +
                "        WHEN g.HomeTeamID = ps.TeamID THEN 'Home' " +
                "        WHEN g.AwayTeamID = ps.TeamID THEN 'Away' " +
                "    END " +
                "ORDER BY " +
                "    g.SeasonYear, GameType";
        System.out.println(getData(query));
    }
    public static List<Map<String, String>> getData(String query) {
        List<Map<String, String>> data = new ArrayList<>();
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(
                    "jdbc:oracle:thin:@oracle.cise.ufl.edu:1521:orcl", "YKAZIMLI", "4vReeT5XtaKNPnc633rMNLeF");
            Statement statement =
                    connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            ResultSet resultSet = statement.executeQuery(query);
            ResultSetMetaData resultSetMetaData = resultSet.getMetaData();
            while (resultSet.next()) {
                Map<String, String> map = new HashMap<>();

                for (int columnNumber = 1; columnNumber <= resultSetMetaData.getColumnCount(); columnNumber++) {
                    map.put(resultSetMetaData.getColumnName(columnNumber),
                            resultSet.getString(resultSetMetaData.getColumnName(columnNumber)));
                }

                data.add(map);
            }

            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return data;
    }

    @PostMapping("/query2")
    public List<Map<String, String>> getQuery2Results(@RequestBody Map<String, String> request) {
        String seasonYear = request.get("seasonYear");
        String query = "SELECT " +
                "    g.SeasonYear AS Year, " +
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
                "WHERE g.SeasonYear = '" + seasonYear + "' " +
                "GROUP BY " +
                "    g.SeasonYear, " +
                "    CASE " +
                "        WHEN g.HomeTeamID = ps.TeamID THEN 'Home' " +
                "        WHEN g.AwayTeamID = ps.TeamID THEN 'Away' " +
                "    END " +
                "ORDER BY " +
                "    g.SeasonYear, GameType";

        return getData(query);
    }


}
