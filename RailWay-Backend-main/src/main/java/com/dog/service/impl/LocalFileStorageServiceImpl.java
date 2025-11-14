package com.dog.service.impl;

import com.dog.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final String cleanFileBaseUrlPath; // Usaremos esta variable "limpia"

    public LocalFileStorageServiceImpl(
            @Value("${file.upload-dir:./uploads_unistay}") String uploadDir,
            @Value("${file.base-url:/uploads_unistay}") String baseUrlPath
    ) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Limpiamos la ruta base para asegurar que no haya dobles barras
        String tempBaseUrl = baseUrlPath.startsWith("/") ? baseUrlPath : "/" + baseUrlPath;
        if (tempBaseUrl.endsWith("/")) {
            this.cleanFileBaseUrlPath = tempBaseUrl.substring(0, tempBaseUrl.length() - 1);
        } else {
            this.cleanFileBaseUrlPath = tempBaseUrl;
        }

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio para los archivos subidos.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subfolder) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Fallo al guardar archivo vacío.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } catch (Exception e) {
            // No hay extensión de archivo
        }
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        Path targetDirectory = this.fileStorageLocation;
        if (subfolder != null && !subfolder.isBlank()) {
            targetDirectory = this.fileStorageLocation.resolve(subfolder);
            if (!Files.exists(targetDirectory)) {
                Files.createDirectories(targetDirectory);
            }
        }

        Path targetLocation = targetDirectory.resolve(newFileName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        }

        String relativePath = (subfolder != null && !subfolder.isBlank() ? subfolder + "/" : "") + newFileName;

        // Construimos la URL final de forma segura
        String finalUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(this.cleanFileBaseUrlPath)
                .path("/")
                .path(relativePath)
                .toUriString();

        // Línea de depuración para ver la URL exacta que se está generando
        System.out.println("URL de imagen generada y guardada en BD: " + finalUrl);

        return finalUrl;
    }

    @Override
    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || fileUrl.isBlank()) {
            System.err.println("FileStorageService: Intento de eliminar archivo con URL nula o vacía.");
            return;
        }

        try {
            String contextPath = ServletUriComponentsBuilder.fromCurrentContextPath().build().getPath();
            if (contextPath == null || contextPath.equals("/")) {
                contextPath = "";
            }
            String pathAfterContext = fileUrl.startsWith(contextPath) ? fileUrl.substring(contextPath.length()) : fileUrl;

            String pathAfterBaseUrl = pathAfterContext.startsWith(this.cleanFileBaseUrlPath) ? pathAfterContext.substring(this.cleanFileBaseUrlPath.length()) : pathAfterContext;

            String relativeFilePath = pathAfterBaseUrl.startsWith("/") ? pathAfterBaseUrl.substring(1) : pathAfterBaseUrl;

            if (relativeFilePath.isBlank()) {
                System.err.println("FileStorageService: No se pudo extraer el path relativo del archivo de la URL: " + fileUrl);
                return;
            }

            Path filePath = this.fileStorageLocation.resolve(relativeFilePath).normalize();
            System.out.println("FileStorageService: Intentando eliminar archivo en path: " + filePath.toString());

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("FileStorageService: Archivo eliminado exitosamente: " + filePath.toString());
            } else {
                System.err.println("FileStorageService: El archivo a eliminar no existe en el path: " + filePath.toString());
            }
        } catch (Exception e) {
            System.err.println("FileStorageService: Error al eliminar el archivo: " + fileUrl + " - " + e.getMessage());
        }
    }
}