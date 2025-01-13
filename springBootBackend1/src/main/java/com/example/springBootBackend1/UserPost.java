package com.example.springBootBackend1;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "userPosts")
public class UserPost {

    @Id
    private String id;

    @Field("usernames")
    private String[] usernames;

    @Field("posts")
    private byte[][] posts;

    @Field("taggedAccounts")
    private Object[][][] taggedAccounts;

    @Field("locationOfPost")
    private String locationOfPost;

    @Field("dateTimeOfPost")
    private Date dateTimeOfPost;

    @Field("slides")
    private int[] slides;

    @Field("category")
    private String category;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String[] getUsernames() {
        return usernames;
    }

    public void setUsernames(String[] usernames) {
        this.usernames = usernames;
    }

    public byte[][] getPosts() {
        return posts;
    }

    public void setPosts(byte[][] posts) {
        this.posts = posts;
    }

    public Object[][][] getTaggedAccounts() {
        return taggedAccounts;
    }

    public void setTaggedAccounts(Object[][][] taggedAccounts) {
        this.taggedAccounts = taggedAccounts;
    }

    public String getLocationOfPost() {
        return locationOfPost;
    }

    public void setLocationOfPost(String locationOfPost) {
        this.locationOfPost = locationOfPost;
    }

    public Date getDateTimeOfPost() {
        return dateTimeOfPost;
    }

    public void setDateTimeOfPost(Date dateTimeOfPost) {
        this.dateTimeOfPost = dateTimeOfPost;
    }

    public int[] getSlides() {
        return slides;
    }

    public void setSlides(int[] slides) {
        this.slides = slides;
    }
    
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
