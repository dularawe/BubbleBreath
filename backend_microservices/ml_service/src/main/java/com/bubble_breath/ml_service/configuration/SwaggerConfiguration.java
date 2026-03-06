package com.bubble_breath.ml_service.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI mlServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ML Service API")
                        .description("Endpoints for image classification and CRUD on image ratings")
                        .version("1.0.0"));
    }
}

