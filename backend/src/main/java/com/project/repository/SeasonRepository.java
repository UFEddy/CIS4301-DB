package com.project.repository;

import com.project.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface SeasonRepository extends JpaRepository<Season, Integer> {
    @Query("SELECT s FROM Season s")
    List<Season> findAllSeasons();
}