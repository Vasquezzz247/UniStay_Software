package com.dog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.dog")
@EntityScan(basePackages = "com.dog.entities")
@EnableJpaRepositories(basePackages = "com.dog.repository")
public class UniStayApplication {
    public static void main(String[] args) {
        SpringApplication.run(UniStayApplication.class, args);
    }
}
