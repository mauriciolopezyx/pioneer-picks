package com.pioneerpicks.pioneerpicks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 2592000)
@SpringBootApplication
public class PioneerPicksApplication {

	public static void main(String[] args) {
		SpringApplication.run(PioneerPicksApplication.class, args);
	}

}
