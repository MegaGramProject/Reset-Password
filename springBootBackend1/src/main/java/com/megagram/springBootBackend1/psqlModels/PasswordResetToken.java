package com.megagram.springBootBackend1.psqlModels;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;

    @Column(name = "salt", length = 30)
    private String salt;


    @Column(name = "hashed_token", length = 44)
    private String hashedToken;

    @Column(name = "expiration")
    private LocalDateTime expiration;

    public PasswordResetToken() {
    }

    public PasswordResetToken(int userId, String salt, String hashedToken, LocalDateTime expiration) {
        this.userId = userId;
        this.salt = salt;
        this.hashedToken = hashedToken;
        this.expiration = expiration;
    }

    public int getId() {
        return this.id;
    }

    public int getUserId() {
        return this.userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getSalt() {
        return this.salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getHashedToken() {
        return this.hashedToken;
    }

    public void setHashedToken(String hashedToken) {
        this.hashedToken = hashedToken;
    }

    public LocalDateTime getExpiration() {
        return this.expiration;
    }

    public void setExpiration(LocalDateTime expiration) {
        this.expiration = expiration;
    }

}
