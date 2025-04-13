package edu.cit.swiftthrift.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/products";

    public List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> filenames = new ArrayList<>();

        // Ensure directory exists
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs(); // Create folders if missing
        }

        // Also ensure it's created for NIO as well
        Files.createDirectories(Paths.get(uploadDir));

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                filenames.add(filename);
            }
        }

        return filenames;
    }
}
