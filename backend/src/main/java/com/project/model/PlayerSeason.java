package com.project.model;

import jakarta.persistence.*;

@Entity
public class PlayerSeason {

    @EmbeddedId
    private PlayerSeasonId id;

    private Double salary;
    private Float war;

    public PlayerSeason() {}

    public PlayerSeasonId getId() {
        return id;
    }

    public void setId(PlayerSeasonId id) {
        this.id = id;
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