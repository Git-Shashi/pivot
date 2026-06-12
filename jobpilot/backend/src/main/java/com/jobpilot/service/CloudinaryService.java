package com.jobpilot.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jobpilot.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<?, ?> upload(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "raw"
                    ));
        } catch (IOException e) {
            throw new BadRequestException("File upload failed: " + e.getMessage());
        }
    }

    public void delete(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
        } catch (IOException e) {
            throw new BadRequestException("File delete failed: " + e.getMessage());
        }
    }
}
