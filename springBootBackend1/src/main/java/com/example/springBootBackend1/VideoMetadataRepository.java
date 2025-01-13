package com.example.springBootBackend1;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface VideoMetadataRepository extends MongoRepository<VideoMetadata, String> {
    VideoMetadata[] findByOverallPostId(String overallPostId);

}
