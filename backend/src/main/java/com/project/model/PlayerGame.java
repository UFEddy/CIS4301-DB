package com.project.model;

import jakarta.persistence.*;

@Entity
public class PlayerGame {

    @EmbeddedId
    private PlayerGameId id;

    @Column(name = "war", columnDefinition = "binary_double") // Align with database column type
    private Double war;

    public PlayerGame() {}

    // Getters and Setters for `id` and `war`
    public PlayerGameId getId() {
        return id;
    }

    public void setId(PlayerGameId id) {
        this.id = id;
    }

    public Double getWar() {
        return war;
    }

    public void setWar(Double war) {
        this.war = war;
    }
}