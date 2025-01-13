package com.example.springBootBackend1;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "profilePhotos")
public class ProfilePhoto {


    @Id
    private String id;

    @Field("username")
    @Indexed(unique = true)
    private String username;

    @Field("profilePhoto")
    private byte[] profilePhoto;

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public byte[] getProfilePhoto() {
        return this.profilePhoto;
    }

    public void setPhoto(byte[] profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}
