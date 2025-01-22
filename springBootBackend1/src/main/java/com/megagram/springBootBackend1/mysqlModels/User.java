package com.megagram.springBootBackend1.mysqlModels;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, length = 30)
    private String username;

    @Column(name = "fullName", length = 50)
    private String fullName;

    @Column(length = 30)
    private String salt;

    @Column(name = "hashedPassword", length = 60)
    private String hashedPassword;

    @Column(name = "contactInfo")
    private String contactInfo; // encrypted with Google-Cloud KMS for all users

    @Column(name = "dateOfBirth")
    private String dateOfBirth; // encrypted with Google-Cloud KMS when is_private is True

    @Column(name = "isVerified")
    private Boolean isVerified;

    @Column(name = "isPrivate")
    private Boolean isPrivate;

    @Column(name = "accountBasedIn")
    private String accountBasedIn;  // encrypted with Google-Cloud KMS when is_private is True

    public User() {
    }

    public User(String username, String fullName, String salt, String hashedPassword,
    String contactInfo, String dateOfBirth, Boolean isVerified, Boolean isPrivate,
    String accountBasedIn) {
        this.username = username;
        this.fullName = fullName;
        this.salt = salt;
        this.hashedPassword = hashedPassword;
        this.contactInfo = contactInfo;
        this.dateOfBirth = dateOfBirth;
        this.isVerified = isVerified;
        this.isPrivate = isPrivate;
        this.accountBasedIn = accountBasedIn;
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return this.fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSalt() {
        return this.salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getHashedPassword() {
        return this.hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getContactInfo() {
        return this.contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getDateOfBirth() {
        return this.dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Boolean getIsVerified() {
        return this.isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsPrivate() {
        return this.isPrivate;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public String getAccountBasedIn() {
        return this.accountBasedIn;
    }

    public void setAccountBasedIn(String accountBasedIn) {
        this.accountBasedIn = accountBasedIn;
    }
}
