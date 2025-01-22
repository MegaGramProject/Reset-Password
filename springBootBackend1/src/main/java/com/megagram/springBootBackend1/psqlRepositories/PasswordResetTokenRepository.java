package com.megagram.springBootBackend1.psqlRepositories;

import com.megagram.springBootBackend1.psqlModels.PasswordResetToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    
    @Query("SELECT p FROM PasswordResetToken p WHERE p.userId = :userId")
    List<PasswordResetToken> findByUserId(@Param("userId") int userId);
}
