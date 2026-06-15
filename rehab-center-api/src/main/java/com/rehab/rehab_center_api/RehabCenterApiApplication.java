package com.rehab.rehab_center_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RehabCenterApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RehabCenterApiApplication.class, args);
	}

}
