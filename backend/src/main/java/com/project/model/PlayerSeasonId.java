package com.project.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PlayerSeasonId implements Serializable {
    private Integer playerId;
    private Integer teamId;
    private Integer seasonYear;

    public PlayerSeasonId() {}

    public PlayerSeasonId(Integer playerId, Integer teamId, Integer seasonYear) {
        this.playerId = playerId;
        this.teamId = teamId;
        this.seasonYear = seasonYear;
    }

    public Integer getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Integer playerId) {
        this.playerId = playerId;
    }

    public Integer getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public Integer getSeasonYear() {
        return seasonYear;
    }

    public void setSeasonYear(Integer seasonYear) {
        this.seasonYear = seasonYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlayerSeasonId that = (PlayerSeasonId) o;
        return Objects.equals(playerId, that.playerId) &&
                Objects.equals(teamId, that.teamId) &&
                Objects.equals(seasonYear, that.seasonYear);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerId, teamId, seasonYear);
    }
}