package com.fitnesstracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FitnessTrackerApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FitnessTrackerApiApplication.class, args);
	}

}
