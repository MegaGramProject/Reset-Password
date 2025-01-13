package com.example.springBootBackend1;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserPostRepository extends MongoRepository<UserPost, String> {

    UserPost[] findByUsernamesContaining(String username);

    Optional<UserPost> findById(String id);

    @Query("{ 'taggedAccounts': { $elemMatch: { $elemMatch: { $elemMatch: { $eq: ?0 } } } } }")
    UserPost[] findByTaggedAccountsContaining(String username);

    @Query("{ 'category': ?0}")
    UserPost[] findByCategory(String category);

}
