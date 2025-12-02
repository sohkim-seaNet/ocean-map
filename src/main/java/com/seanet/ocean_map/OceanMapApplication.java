package com.seanet.ocean_map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
public class OceanMapApplication {

	public static void main(String[] args) {
		SpringApplication.run(OceanMapApplication.class, args);
	}

}
