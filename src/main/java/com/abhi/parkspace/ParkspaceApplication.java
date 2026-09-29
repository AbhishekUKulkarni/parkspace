package com.abhi.parkspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.abhi.parkspace")
@EnableJpaRepositories(basePackages = "com.abhi.parkspace")
public class ParkspaceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParkspaceApplication.class, args);
	}

}
