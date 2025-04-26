package edu.cit.swiftthrift.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map requests for /uploads/** to the actual directory where files are stored
        String uploadDir = Paths.get("uploads").toAbsolutePath().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");

        System.out.println("Configured resource handler for uploads at: " + uploadDir);
    }
}
