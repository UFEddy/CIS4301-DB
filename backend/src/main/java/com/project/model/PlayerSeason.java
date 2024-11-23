package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "PlayerSeason")
@IdClass(PlayerSeasonId.class)
public class PlayerSeason {
    @Id
    private Integer playerID;

    @Id
    private Integer teamID;

    @Id
    private Integer seasonYear;

    private Double salary;
    private Float war;

    public Integer getPlayerID() {
        return playerID;
    }

    public void setPlayerID(Integer playerID) {
        this.playerID = playerID;
    }

    public Integer getTeamID() {
        return teamID;
    }

    public void setTeamID(Integer teamID) {
        this.teamID = teamID;
    }

    public Integer getSeasonYear() {
        return seasonYear;
    }

    public void setSeasonYear(Integer seasonYear) {
        this.seasonYear = seasonYear;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public Float getWar() {
        return war;
    }

    public void setWar(Float war) {
        this.war = war;
    }
}
