package com.example.springBootBackend1;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserPostRepository extends MongoRepository<UserPost, String> {
    UserPost[] findByUsernamesContaining(String username);

}
