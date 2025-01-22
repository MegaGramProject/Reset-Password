package com.megagram.springBootBackend1.mysqlRepositories;

import com.megagram.springBootBackend1.mysqlModels.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int id);
}
