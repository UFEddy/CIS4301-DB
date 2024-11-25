package com.project.repository;

import com.project.model.PlayerGame;
import com.project.model.PlayerGameId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerGameRepository extends JpaRepository<PlayerGame, PlayerGameId> {}