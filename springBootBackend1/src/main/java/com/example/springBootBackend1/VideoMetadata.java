package com.example.springBootBackend1;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "videosMetadata")
public class VideoMetadata {

    @Id
    private String id;

    @Field("usernames")
    private String[] usernames;

    @Field("locationOfPost")
    private String locationOfPost;

    @Field("dateTimeOfPost")
    private Date dateTimeOfPost;

    @Field("taggedAccounts")
    private String[] taggedAccounts;

    @Field("videoId")
    private String videoId;

    @Field("overallPostId")
    private String overallPostId;

    @Field("slideNumber")
    private int slideNumber;

    @Field("sections")
    private List<Map<String, String>> sections;

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

    public String[] getTaggedAccounts() {
        return taggedAccounts;
    }

    public void setTaggedAccounts(String[] taggedAccounts) {
        this.taggedAccounts = taggedAccounts;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getOverallPostId() {
        return overallPostId;
    }

    public void setOverallPostId(String overallPostId) {
        this.overallPostId = overallPostId;
    }

    public int getSlideNumber() {
        return slideNumber;
    }

    public void setSlideNumber(int slideNumber) {
        this.slideNumber = slideNumber;
    }

    public List<Map<String, String>> getSections() {
        return sections;
    }
}
