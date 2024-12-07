package com.project.controller;

import com.project.model.Season;
import com.project.repository.SeasonRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seasons")
public class SeasonController {
    private final SeasonRepository seasonRepository;

    public SeasonController(SeasonRepository seasonRepository) {
        this.seasonRepository = seasonRepository;
    }

    @GetMapping
    public List<Season> getAllSeasons() {
        return seasonRepository.findAll();
    }

    @PostMapping
    public Season createSeason(@RequestBody Season season) {
        return seasonRepository.save(season);
    }
}
