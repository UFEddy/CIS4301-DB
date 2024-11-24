package com.project.model;

import jakarta.persistence.*;

@Entity
public class PlayerGame {

    @EmbeddedId
    private PlayerGameId id;

    private Float war;

    public PlayerGame() {}

    // Getters and Setters for `id` and `war`
    public PlayerGameId getId() {
        return id;
    }

    public void setId(PlayerGameId id) {
        this.id = id;
    }

    public Float getWar() {
        return war;
    }

    public void setWar(Float war) {
        this.war = war;
    }
}