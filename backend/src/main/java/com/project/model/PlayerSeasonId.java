package com.project.model;

import java.io.Serializable;
import java.util.Objects;

public class PlayerSeasonId implements Serializable {
    private Integer playerID;
    private Integer teamID;
    private Integer seasonYear;

    public PlayerSeasonId(Integer playerID, Integer teamID, Integer seasonYear) {
        this.playerID = playerID;
        this.teamID = teamID;
        this.seasonYear = seasonYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlayerSeasonId that = (PlayerSeasonId) o;
        return Objects.equals(playerID, that.playerID) && Objects.equals(teamID, that.teamID) && Objects.equals(seasonYear, that.seasonYear);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerID, teamID, seasonYear);
    }
}