package com.example.springBootBackend1;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfilePhotoRepository extends MongoRepository<ProfilePhoto, String> {
    ProfilePhoto findByUsername(String username);

}
