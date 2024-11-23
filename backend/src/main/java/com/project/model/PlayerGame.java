package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "PlayerGame")
@IdClass(PlayerGameId.class)
public class PlayerGame {
    @Id
    private Integer playerID;

    @Id
    private Integer gameID;

    private Float war;

    public Integer getPlayerID() {
        return playerID;
    }

    public void setPlayerID(Integer playerID) {
        this.playerID = playerID;
    }

    public Integer getGameID() {
        return gameID;
    }

    public void setGameID(Integer gameID) {
        this.gameID = gameID;
    }

    public Float getWar() {
        return war;
    }

    public void setWar(Float war) {
        this.war = war;
    }

    // Getters and Setters
    // ...
}
