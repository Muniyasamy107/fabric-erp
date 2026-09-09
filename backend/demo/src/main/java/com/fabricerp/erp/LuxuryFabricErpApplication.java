package com.fabricerp.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LuxuryFabricErpApplication {
    public static void main(String[] args) {
        SpringApplication.run(LuxuryFabricErpApplication.class, args);
    }
}