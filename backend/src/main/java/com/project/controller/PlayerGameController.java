package com.project.controller;

import com.project.model.PlayerGame;
import com.project.model.PlayerGameId;
import com.project.repository.PlayerGameRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playerGames")
public class PlayerGameController {

    private final PlayerGameRepository playerGameRepository;

    public PlayerGameController(PlayerGameRepository playerGameRepository) {
        this.playerGameRepository = playerGameRepository;
    }

    @GetMapping
    public List<PlayerGame> getAllPlayerGames() {
        return playerGameRepository.findAll();
    }

    @GetMapping("/{playerId}/{gameId}")
    public ResponseEntity<PlayerGame> getPlayerGameById(
            @PathVariable Integer playerId,
            @PathVariable Integer gameId) {
        PlayerGameId id = new PlayerGameId(playerId, gameId);
        return playerGameRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlayerGame createPlayerGame(@RequestBody PlayerGame playerGame) {
        return playerGameRepository.save(playerGame);
    }

    @PutMapping("/{playerId}/{gameId}")
    public ResponseEntity<PlayerGame> updatePlayerGame(
            @PathVariable Integer playerId,
            @PathVariable Integer gameId,
            @RequestBody PlayerGame playerGameDetails) {
        PlayerGameId id = new PlayerGameId(playerId, gameId);
        return playerGameRepository.findById(id)
                .map(playerGame -> {
                    playerGame.setWar(playerGameDetails.getWar());
                    PlayerGame updatedPlayerGame = playerGameRepository.save(playerGame);
                    return ResponseEntity.ok(updatedPlayerGame);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{playerId}/{gameId}")
    public ResponseEntity<Void> deletePlayerGame(
            @PathVariable Integer playerId,
            @PathVariable Integer gameId) {
        PlayerGameId id = new PlayerGameId(playerId, gameId);
        if (playerGameRepository.existsById(id)) {
            playerGameRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
