package com.project.controller;

import com.project.model.PlayerSeason;
import com.project.model.PlayerSeasonId;
import com.project.repository.PlayerSeasonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playerSeasons")
public class PlayerSeasonController {

    private final PlayerSeasonRepository playerSeasonRepository;

    public PlayerSeasonController(PlayerSeasonRepository playerSeasonRepository) {
        this.playerSeasonRepository = playerSeasonRepository;
    }

    @GetMapping
    public List<PlayerSeason> getAllPlayerSeasons() {
        return playerSeasonRepository.findAll();
    }

    @GetMapping("/{playerId}/{teamId}/{seasonYear}")
    public ResponseEntity<PlayerSeason> getPlayerSeasonById(
            @PathVariable Integer playerId,
            @PathVariable Integer teamId,
            @PathVariable Integer seasonYear) {
        PlayerSeasonId id = new PlayerSeasonId(playerId, teamId, seasonYear);
        return playerSeasonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlayerSeason createPlayerSeason(@RequestBody PlayerSeason playerSeason) {
        return playerSeasonRepository.save(playerSeason);
    }

    @PutMapping("/{playerId}/{teamId}/{seasonYear}")
    public ResponseEntity<PlayerSeason> updatePlayerSeason(
            @PathVariable Integer playerId,
            @PathVariable Integer teamId,
            @PathVariable Integer seasonYear,
            @RequestBody PlayerSeason playerSeasonDetails) {
        PlayerSeasonId id = new PlayerSeasonId(playerId, teamId, seasonYear);
        return playerSeasonRepository.findById(id)
                .map(playerSeason -> {
                    playerSeason.setSalary(playerSeasonDetails.getSalary());
                    playerSeason.setWar(playerSeasonDetails.getWar());
                    PlayerSeason updatedPlayerSeason = playerSeasonRepository.save(playerSeason);
                    return ResponseEntity.ok(updatedPlayerSeason);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{playerId}/{teamId}/{seasonYear}")
    public ResponseEntity<Void> deletePlayerSeason(
            @PathVariable Integer playerId,
            @PathVariable Integer teamId,
            @PathVariable Integer seasonYear) {
        PlayerSeasonId id = new PlayerSeasonId(playerId, teamId, seasonYear);
        if (playerSeasonRepository.existsById(id)) {
            playerSeasonRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
