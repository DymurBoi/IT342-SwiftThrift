package edu.cit.swiftthrift.controller;

import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/check-file")
    public Map<String, Object> checkFile(@RequestParam String path) {
        Map<String, Object> result = new HashMap<>();
        result.put("requestedPath", path);

        try {
            // Check if the file exists
            Path filePath = Paths.get(path);
            File file = filePath.toFile();

            result.put("exists", file.exists());
            result.put("isFile", file.isFile());
            result.put("isDirectory", file.isDirectory());
            result.put("absolutePath", file.getAbsolutePath());

            if (file.exists() && file.isFile()) {
                result.put("size", file.length());
                result.put("canRead", file.canRead());
                result.put("contentType", Files.probeContentType(filePath));
            }

            return result;
        } catch (Exception e) {
            result.put("error", e.getMessage());
            return result;
        }
    }

    @GetMapping("/file-info")
    public Map<String, Object> getFileInfo(@RequestParam String path) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Convert relative path to absolute
            String basePath = "uploads";
            Path resolvedPath = Paths.get(basePath, path);
            File file = resolvedPath.toFile();

            result.put("exists", file.exists());
            result.put("relativePath", path);
            result.put("resolvedPath", resolvedPath.toString());
            result.put("absolutePath", file.getAbsolutePath());

            if (file.exists()) {
                result.put("size", file.length());
                result.put("lastModified", file.lastModified());
                result.put("isDirectory", file.isDirectory());
                result.put("isFile", file.isFile());
            }

            return result;
        } catch (Exception e) {
            result.put("error", e.getMessage());
            return result;
        }
    }
}
