package com.project;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MlbPlayerDbApplication {

	public static void main(String[] args) {

		// Load the .env file
		Dotenv dotenv = Dotenv.configure()
				.directory("./")  // Specify the directory where .env is located
				.ignoreIfMalformed()  // Continue even if .env has syntax issues
				.ignoreIfMissing()  // Continue even if .env is not found
				.load();

		// Optionally, log a loaded variable for debugging
		// System.out.println("Username: " + dotenv.get("PASSWORD"));

		SpringApplication.run(MlbPlayerDbApplication.class, args);
	}

}
