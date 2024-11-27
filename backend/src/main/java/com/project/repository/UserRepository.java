package com.project.repository;

import com.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE TRIM(UPPER(u.username)) = TRIM(UPPER(:username))")
    Optional<User> findByUsername(@Param("username") String username);


}
