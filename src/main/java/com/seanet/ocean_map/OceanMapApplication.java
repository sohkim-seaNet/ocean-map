package com.seanet.ocean_map;

import com.seanet.ocean_map.domain.ShipCurrent;
import com.seanet.ocean_map.repository.ShipCurrentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@SpringBootApplication
@EnableScheduling
public class OceanMapApplication {

	public static void main(String[] args) {
		SpringApplication.run(OceanMapApplication.class, args);
	}

}
