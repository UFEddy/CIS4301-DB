package com.project.loader;

import com.project.model.User;
import com.project.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userService.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword("adminpass"); // Raw password
            adminUser.setEnabled(true);
            adminUser.setRoles(Set.of("ROLE_ADMIN"));
            userService.saveUser(adminUser);
        }

        if (!userService.existsByUsername("testuser")) {
            User normalUser = new User();
            normalUser.setUsername("testuser");
            normalUser.setPassword("password"); // Raw password
            normalUser.setEnabled(true);
            normalUser.setRoles(Set.of("ROLE_USER"));
            userService.saveUser(normalUser);
        }
    }
}