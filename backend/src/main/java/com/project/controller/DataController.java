package com.project.controller;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DataController {
    public static void main(String[] args) throws SQLException {
        List<Map<String, String>> data = getData("SELECT * FROM airport");
        System.out.println(data);
        for (Map<String, String> map : data){
            System.out.println(map.toString());
        }
    }

    public static List<Map<String, String>> getData(String query) {
        List<Map<String, String>> data = new ArrayList<>();
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(
                    "jdbc:oracle:thin:@oracle.cise.ufl.edu:1521:orcl", "ykazimli",
                    "<PASSWORD>");
            Statement statement =
                    connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            ResultSet resultSet = statement.executeQuery(query);
            ResultSetMetaData resultSetMetaData = resultSet.getMetaData();

            while (resultSet.next()) {
                Map<String, String> map = new HashMap<>();

                for (int columnNumber = 1; columnNumber < resultSetMetaData.getColumnCount(); columnNumber++) {
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
}
