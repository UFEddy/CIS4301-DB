package com.project.repository;

import com.project.model.PlayerSeason;
import com.project.model.PlayerSeasonId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerSeasonRepository extends JpaRepository<PlayerSeason, PlayerSeasonId> {}