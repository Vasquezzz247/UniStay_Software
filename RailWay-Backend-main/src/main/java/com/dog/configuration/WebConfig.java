package com.dog.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:./uploads_unistay}")
    private String uploadDir;

    @Value("${file.base-url:/uploads_unistay}")
    private String baseUrlPath;

    // SIN CONFIGURACIÓN DE CORS AQUÍ

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path resolvedUploadPath = Paths.get(uploadDir).toAbsolutePath();
        String absoluteUploadPath = resolvedUploadPath.normalize().toString();

        String cleanBaseUrlPath = baseUrlPath.startsWith("/") ? baseUrlPath : "/" + baseUrlPath;
        if (cleanBaseUrlPath.endsWith("/")) {
            cleanBaseUrlPath = cleanBaseUrlPath.substring(0, cleanBaseUrlPath.length() - 1);
        }
        String urlPattern = cleanBaseUrlPath + "/**";
        String resourceLocation = "file:" + absoluteUploadPath + (absoluteUploadPath.endsWith("/") ? "" : "/");

        registry.addResourceHandler(urlPattern)
                .addResourceLocations(resourceLocation);
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
    }
}