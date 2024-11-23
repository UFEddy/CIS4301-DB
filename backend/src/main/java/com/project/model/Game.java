package com.project.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Game")
public class Game {
    @Id
    private Integer gameID;
    private Date gameDate;
    private Integer attendance;

    @ManyToOne
    @JoinColumn(name = "seasonYear", referencedColumnName = "seasonYear")
    private Season season;

    @ManyToOne
    @JoinColumn(name = "homeTeamID", referencedColumnName = "teamID")
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "awayTeamID", referencedColumnName = "teamID")
    private Team awayTeam;

    public Integer getGameID() {
        return gameID;
    }

    public void setGameID(Integer gameID) {
        this.gameID = gameID;
    }

    public Date getGameDate() {
        return gameDate;
    }

    public void setGameDate(Date gameDate) {
        this.gameDate = gameDate;
    }

    public Integer getAttendance() {
        return attendance;
    }

    public void setAttendance(Integer attendance) {
        this.attendance = attendance;
    }

    public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
    }

    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(Team awayTeam) {
        this.awayTeam = awayTeam;
    }
}
