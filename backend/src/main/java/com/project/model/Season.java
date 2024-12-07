package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Season")
public class Season {
    @Id
    @Column
    private Integer seasonYear;

    public Integer getSeasonYear() {
        return seasonYear;
    }

    public void setSeasonYear(Integer seasonYear) {
        this.seasonYear = seasonYear;
    }
}