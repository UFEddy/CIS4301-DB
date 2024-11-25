package com.project.model;

import java.io.Serializable;
import java.util.Objects;

public class PlayerGameId implements Serializable {
    private Integer playerID;
    private Integer gameID;

    public PlayerGameId(Integer playerID, Integer gameID) {
        this.playerID = playerID;
        this.gameID = gameID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlayerGameId that = (PlayerGameId) o;
        return Objects.equals(playerID, that.playerID) && Objects.equals(gameID, that.gameID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerID, gameID);
    }
}