package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Team")
public class Team {
    @Id
    private Integer teamID;
    private String teamName;
    private Integer teamStanding;

    @ManyToOne
    @JoinColumn(name = "teamSeason", referencedColumnName = "seasonYear")
    private Season season;

    // Getters and Setters
    public Integer getTeamID() {
        return teamID;
    }

    public void setTeamID(Integer teamID) {
        this.teamID = teamID;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Integer getTeamStanding() {
        return teamStanding;
    }

    public void setTeamStanding(Integer teamStanding) {
        this.teamStanding = teamStanding;
    }

    public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
    }
}