package com.university.festival_api;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**").allowedOrigins("https://festival-api-j9rv.vercel.app")
        .allowedMethods("GET","PUT","POST","DELETE","OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
    }
}
