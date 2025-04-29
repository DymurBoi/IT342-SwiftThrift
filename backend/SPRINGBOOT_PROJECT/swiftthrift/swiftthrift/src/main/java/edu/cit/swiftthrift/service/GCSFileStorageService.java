package edu.cit.swiftthrift.service;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GCSFileStorageService {

    @Value("${gcs.bucket.name}")
    private String bucketName;

    @Value("${gcs.credentials.path}")
    private String credentialsPath;

    private Storage storage;

    @PostConstruct
    public void init() throws IOException {
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("gcs-key.json");
        storage = StorageOptions.newBuilder()
                .setCredentials(ServiceAccountCredentials.fromStream(serviceAccount))
                .build()
                .getService();
    }

    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
            String uniqueFilename = UUID.randomUUID() + extension;

            BlobId blobId = BlobId.of(bucketName, uniqueFilename);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

            storage.create(blobInfo, file.getBytes());

            String publicUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, uniqueFilename);
            urls.add(publicUrl);
        }

        return urls;
    }
}
