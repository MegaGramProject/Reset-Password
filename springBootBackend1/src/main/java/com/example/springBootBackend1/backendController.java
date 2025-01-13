package com.example.springBootBackend1;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;

import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@RestController
public class backendController {



    private HttpServletRequest request;
    private HttpServletResponse response;
    private final ResourceLoader resourceLoader;

    public backendController(HttpServletRequest request, HttpServletResponse response, ResourceLoader resourceLoader) {
        this.request = request;
        this.response = response;
        this.resourceLoader = resourceLoader;
    }

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    public static final String twilioAccountSid = System.getenv("accountSid");

    public static final String twilioAuthToken = System.getenv("authToken");

    public static final String twilioPhoneNumber = System.getenv("twilioPhoneNumber");

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

    @Autowired
    private ProfilePhotoRepository profilePhotoRepository;

    @Autowired
    private UserPostRepository userPostRepository;

    @Autowired
    private VideoMetadataRepository videoMetadataRepository;

    @PostMapping("/sendLoginLink")
    @CrossOrigin(origins = "http://localhost:3001")
    public String sendLoginLink(@RequestBody Map<String, String> request) {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            if (request.containsKey("email")) {
                String email = request.get("email");
                String username = getUsernameByEmail(connection, email);
                if (username != null) {
                    sendEmail(email, username);
                    return "{\"userFound\": true}";
                } else {
                    return "{\"userFound\": false}";
                }
            } else if (request.containsKey("number")) {
                String number = request.get("number");
                String username = getUsernameByPhoneNumber(connection, number);
                if (username != null) {
                    sendSms(number, username);
                    return "{\"userFound\": true}";
                } else {
                    return "{\"userFound\": false}";
                }
            } else if (request.containsKey("username")) {
                String username = request.get("username");
                String contactInfo = getContactInfoByUsername(connection, username);
                if (contactInfo != null) {
                    if (contactInfo.contains("@")) {
                        sendEmail(contactInfo, username);
                    } else {
                        sendSms(contactInfo, username);
                    }
                    return "{\"userFound\": true}";
                } else {
                    return "{\"userFound\": false}";
                }
            } else {
                return "{\"error\": \"Invalid request\"}";
            }
        } catch (Exception e) {
            return "{\"error\": \"Internal server error\"}";
        }
    }

    private String getUsernameByEmail(Connection connection, String email) throws Exception {
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT username FROM myapp_user WHERE contactInfo = '" + email + "'");
        if (rs.next()) {
            return rs.getString("username");
        }
        return null;
    }

    private String getUsernameByPhoneNumber(Connection connection, String number) throws Exception {
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT username FROM myapp_user WHERE contactInfo = '" + number + "'");
        if (rs.next()) {
            return rs.getString("username");
        }
        return null;
    }

    private String getContactInfoByUsername(Connection connection, String username) throws Exception {
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT contactInfo FROM myapp_user WHERE username = '" + username + "'");
        if (rs.next()) {
            return rs.getString("contactInfo");
        }
        return null;
    }

    private void sendEmail(String email, String username) throws Exception {
        String host = "smtp.gmail.com";
        String from = "megagram664@gmail.com";
        String pass = "daqr zlkq vvil exfi";

        Properties props = System.getProperties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.user", from);
        props.put("mail.smtp.password", pass);
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");

        Session session = Session.getDefaultInstance(props);
        MimeMessage message = new MimeMessage(session);

        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));

        message.setSubject(username + ", we've made it easy to get back on Megagram");

        String htmlContent = String.format(
                """
                        <html>
                        <body>
                            <img src="https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg" alt="image1" style="height:13em; width: 16em; object-fit: contain; margin-left:650px;">
                            <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg" alt="image2" style="height:13em; width: 16em; object-fit: contain;">
                            <div style="width: 560px; font-family:Arial; line-height:1.4; font-size:1.3em; margin-left: 630px; color: #484a49">
                                <p>Hi %s,</p>
                                <p>Sorry to hear you're having trouble logging into Megagram. We got a message that you forgot your
                                password. If this was you, you can get right back into your account or reset your password now.</p>
                                <a href="https://google.com" style="background-color: #6fa3f7; color: white; display: inline-block; text-align: center; width: 595px; height: 44px; border-radius: 7px; border: none; font-weight: bold; padding-top:24px; font-size: 17.7px; margin-top: 18px; text-decoration: none; cursor: pointer;">Log in as %s</a>
                                <a href="http://localhost:3001/enterNewPassword/rishavry" style="background-color: #6fa3f7; color: white; display: inline-block; text-align: center; width: 595px; height: 44px; border-radius: 7px; border: none; font-weight: bold; padding-top:24px; font-size: 17.7px; margin-top: 18px; text-decoration: none; cursor: pointer;">Reset your password</a>
                                <p>If you didn't request a login link or a password reset, you can ignore this message.</p>
                                <p>Only people who know your Megagram password or click the login link in this email can log into your account.</p>
                            </div>
                            <p style="color:gray; margin-top: 75px; text-align: center; width:777px; margin-left: 500px;">This email is for Megagram Account Registration. This message was sent to %s and intended for %s.</p>
                        </body>
                        </html>
                        """,
                username, username, email, username);

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(htmlContent, "text/html");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        message.setContent(multipart);

        Transport transport = session.getTransport("smtp");
        transport.connect(host, from, pass);
        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
    }

    private void sendSms(String number, String username) {
        Twilio.init(twilioAccountSid, twilioAuthToken);
        String messageBody = "Account Recovery\n"
                + "Hi " + username
                + ", Sorry to hear you're having trouble logging into Megagram. We got a message that you forgot your "
                + "password. If this was you, you can get right back into your account or reset your password now. If you didn't request "
                + "a login link or a password reset, you can ignore this message. Only people who know your Megagram password or click the login "
                + "link in this email can log into your account. To enter your account: https://google.com. To reset your password: "
                + "http://localhost:3001/enterNewPassword/" + username + ".";

        com.twilio.rest.api.v2010.account.Message
                .creator(new PhoneNumber(number), new PhoneNumber(twilioPhoneNumber), messageBody).create();
    }

    @PostMapping("/cookies/getTokens")
    @CrossOrigin(origins = "http://localhost:8000", allowCredentials = "true")
    public String getTokens(@RequestBody Map<String, String> request, HttpServletResponse response) {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            if (request.containsKey("username")) {
                String username = request.get("username");
                String authToken = generateToken(100);
                String refreshToken = generateToken(100);
                String authTokenSalt = generateToken(32);
                String refreshTokenSalt = generateToken(32);
                String authTokenExpiry = getExpirationDate(45);
                String refreshTokenExpiry = getExpirationDate(4320);
                String hashedAuthToken = hashToken(authToken + authTokenSalt);
                String hashedRefreshToken = hashToken(refreshToken + refreshTokenSalt);

                updateDatabase(connection, username, hashedAuthToken, hashedRefreshToken, authTokenSalt,
                        refreshTokenSalt, authTokenExpiry,
                        refreshTokenExpiry);

                Cookie cookie = new Cookie("authToken" + username, authToken);
                cookie.setMaxAge(2628288);
                cookie.setPath("/cookies");
                cookie.setHttpOnly(true);

                Cookie cookie2 = new Cookie("refreshToken" + username, refreshToken);
                cookie2.setMaxAge(2628288);
                cookie2.setPath("/cookies");
                cookie2.setHttpOnly(true);

                response.addCookie(cookie);
                response.addCookie(cookie2);

                return "Cookies set successfully";
            } else {
                return "{\"error\": \"Invalid request\"}";
            }

        } catch (Exception e) {
            return "{\"error\": \"Internal server error\"}";
        }
    }

    private String generateToken(int byteLength) {
        byte[] randomBytes = new byte[byteLength];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    private String hashToken(String token) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(token.getBytes());
        return Base64.getEncoder().encodeToString(hash);
    }

    private void updateDatabase(Connection connection, String username, String hashedAuthToken,
            String hashedRefreshToken, String authTokenSalt, String refreshTokenSalt, String authTokenExpiry,
            String refreshTokenExpiry) throws Exception {
        String sql = "INSERT INTO userTokens (username, hashedAuthToken, hashedRefreshToken, authTokenSalt, refreshTokenSalt, authTokenExpiry, refreshTokenExpiry) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, hashedAuthToken);
            pstmt.setString(3, hashedRefreshToken);
            pstmt.setString(4, authTokenSalt);
            pstmt.setString(5, refreshTokenSalt);
            pstmt.setString(6, authTokenExpiry);
            pstmt.setString(7, refreshTokenExpiry);
            pstmt.executeUpdate();
        }
    }

    private String getExpirationDate(int minutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, minutes);
        Date expiryDate = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(expiryDate);
    }

    @GetMapping("/getProfilePhoto/{username}")
    @CrossOrigin({"http://localhost:3100", "http://localhost:8011", "http://localhost:8019", "http://localhost:8024",
    "http://localhost:8033"})
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable String username) {
        ProfilePhoto profilePhoto = profilePhotoRepository.findByUsername(username);

        if (profilePhoto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        byte[] photo = profilePhoto.getProfilePhoto();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "image/png");
        headers.set("Content-Length", String.valueOf(photo.length));

        return new ResponseEntity<>(photo, headers, HttpStatus.OK);
    }

    @PostMapping("/getProfilePhotosOfMultipleUsers")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<Map<String, byte[]>> getProfilePhotosOfMultipleUsers(@RequestBody Map<String, String[]> request) {
        if (request.containsKey("listOfUsers")) {
            String[] usernames = request.get("listOfUsers");
            Map<String, byte[]> profilePhotosMap = new HashMap<>();
            
            for (String username : usernames) {
                if(!profilePhotosMap.containsKey(username)) {
                    ProfilePhoto profilePhoto = profilePhotoRepository.findByUsername(username);
                
                    if (profilePhoto != null) {
                        byte[] photo = profilePhoto.getProfilePhoto();
                        profilePhotosMap.put(username, photo);
                    } else {
                        profilePhotosMap.put(username, null);
                    }
                }
            }
            
            return new ResponseEntity<>(profilePhotosMap, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/editProfilePhoto/{username}")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<Void> editProfilePhoto(@RequestParam("newProfilePhoto") MultipartFile newProfilePhoto, @PathVariable String username) {
        
        ProfilePhoto profilePhoto = profilePhotoRepository.findByUsername(username);
        
        if (profilePhoto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        try {
            profilePhoto.setPhoto(newProfilePhoto.getBytes());
            profilePhotoRepository.save(profilePhoto);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:8019")
    @GetMapping("/images/defaultPfp.png")
    public ResponseEntity<Resource> getImage() {
        Resource resource = resourceLoader.getResource("classpath:static/images/defaultPfp.png");
        return ResponseEntity.ok(resource);
    }


    @GetMapping("/getPosts/{username}")
    @CrossOrigin({"http://localhost:3100", "http://localhost:8019"})
    public ResponseEntity<UserPost[]> getPosts(@PathVariable String username) {
        UserPost[] userPosts = userPostRepository.findByUsernamesContaining(username);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        return new ResponseEntity<>(userPosts, headers, HttpStatus.OK);
    }

    @GetMapping("/getTaggedPosts/{username}")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<ArrayList<Map<String, Object>>> getTaggedPosts(@PathVariable String username) {
        UserPost[] userPosts = userPostRepository.findByTaggedAccountsContaining(username);
        
        ArrayList<Map<String, Object>> output = new ArrayList<>();
        
        for (UserPost userPost : userPosts) {
            Object[][][] taggedAccountsOfPost = userPost.getTaggedAccounts();
            
            for (int i = 0; i < taggedAccountsOfPost.length; i++) {
                Object[][] taggedAccountsOfCurrSlide = taggedAccountsOfPost[i];
                
                if (isUserTaggedInSlide(taggedAccountsOfCurrSlide, username)) {
                    Map<String, Object> postDetails = new HashMap<>();
                    postDetails.put("smallestSlideNumberWhereUserIsTagged", userPost.getSlides()[i]);
                    postDetails.put("dateTimeOfPost", userPost.getDateTimeOfPost());
                    postDetails.put("postId", userPost.getId());
                    postDetails.put("slideImage", userPost.getPosts()[i]);
                    
                    output.add(postDetails);
                    
                    break;
                }
            }
        }


        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
    
        return new ResponseEntity<>(output, headers, HttpStatus.OK);
    }


    private boolean isUserTaggedInSlide(Object[][] taggedAccountsOfSlide, String username) {
        for (Object[] taggedAccount : taggedAccountsOfSlide) {
            if (taggedAccount[2].equals(username)) {
                return true;
            }
        }
        return false;
    }

    @GetMapping("/getPostInfo/{postId}")
    @CrossOrigin("http://localhost:3100")
    public ResponseEntity<Object[]> getPostInfo(@PathVariable String postId) {
        Optional<UserPost> userPostsOptional = userPostRepository.findById(postId);
        VideoMetadata[] videosMetadata = videoMetadataRepository.findByOverallPostId(postId);

        Object[] output = new Object[2];

        if (userPostsOptional.isPresent()) {
            output[0] = userPostsOptional.get();
            ((UserPost) output[0]).setPosts(null);
        } else {
            output[0] = null;
        }

        output[1] = videosMetadata;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        return new ResponseEntity<>(output, headers, HttpStatus.OK);
    }

    @GetMapping("/getInDepthPostInfo/{postId}")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<Object[]> getInDepthPostInfo(@PathVariable String postId) {
        Optional<UserPost> userPostsOptional = userPostRepository.findById(postId);
        VideoMetadata[] videosMetadata = videoMetadataRepository.findByOverallPostId(postId);

        Object[] output = new Object[2];

        if (userPostsOptional.isPresent()) {
            output[0] = userPostsOptional.get();
        } else {
            output[0] = null;
        }

        output[1] = videosMetadata;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        return new ResponseEntity<>(output, headers, HttpStatus.OK);
    }

    @PostMapping("/getPostsForMultiplePostIds")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<Map<String, Map<String, Object>>> getPostsForMultiplePostIds(@RequestBody Map<String, String[]> request) {
        if (request.containsKey("postIds")) {
            String[] postIds = request.get("postIds");
            Map<String, Map<String, Object>> postIdToPostInfoMappings = new HashMap<>();
            
            for (String postId : postIds) {
                Optional<UserPost> userPostOptional = userPostRepository.findById(postId);
                if(userPostOptional.isPresent()) {
                    UserPost userPost = userPostOptional.get();
                    Map<String, Object> userPostInfo = new HashMap<>();
                    userPostInfo.put("dateTimeOfPost", userPost.getDateTimeOfPost());
                    userPostInfo.put("base64StringOfImageWithSmallestSlideNumber", userPost.getPosts()[0]);
                    userPostInfo.put("smallestSlideNumber", userPost.getSlides()[0]);
                    userPostInfo.put("hasMoreThanOneSlide", userPost.getSlides().length>1);
                    userPostInfo.put("usernames", userPost.getUsernames());
                    postIdToPostInfoMappings.put(postId, userPostInfo);
                }
                
            }
            
            return new ResponseEntity<>(postIdToPostInfoMappings, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/getPostsRelatedToTopic/{topic}")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<?> getPostsRelatedToTopic(@RequestBody Map<String, String[]> request, @PathVariable String topic) {
        if (request.containsKey("postIds")) {
            String[] postIds = request.get("postIds"); //this is a listOfPostIds of userPosts whose captions hashtag the topic
            Map<String, Map<String, Object>> postIdToPostInfoMappings = new HashMap<>();
            Set<String> setOfPostIds = new HashSet<>();
            
            for (String postId : postIds) {
                Optional<UserPost> userPostOptional = userPostRepository.findById(postId);
                if(userPostOptional.isPresent()) {
                    UserPost userPost = userPostOptional.get();
                    Map<String, Object> userPostInfo = new HashMap<>();
                    userPostInfo.put("dateTimeOfPost", userPost.getDateTimeOfPost());
                    userPostInfo.put("base64StringOfImageWithSmallestSlideNumber", userPost.getPosts()[0]);
                    userPostInfo.put("smallestSlideNumber", userPost.getSlides()[0]);
                    userPostInfo.put("hasMoreThanOneSlide", userPost.getSlides().length>1);
                    userPostInfo.put("usernames", userPost.getUsernames());
                    postIdToPostInfoMappings.put(postId, userPostInfo);
                    setOfPostIds.add(postId);
                }
                
            }

            UserPost[] userPostsCategorizedAsTopic = userPostRepository.findByCategory(topic);

            for(UserPost post : userPostsCategorizedAsTopic) {
                if(!setOfPostIds.contains(post.getId())) {
                    Map<String, Object> userPostInfo = new HashMap<>();
                    userPostInfo.put("dateTimeOfPost", post.getDateTimeOfPost());
                    userPostInfo.put("base64StringOfImageWithSmallestSlideNumber", post.getPosts()[0]);
                    userPostInfo.put("smallestSlideNumber", post.getSlides()[0]);
                    userPostInfo.put("hasMoreThanOneSlide", post.getSlides().length>1);
                    userPostInfo.put("usernames", post.getUsernames());
                    postIdToPostInfoMappings.put(post.getId(), userPostInfo);
                    setOfPostIds.add(post.getId());
                }
            }

            return new ResponseEntity<>(postIdToPostInfoMappings, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getSingleSlideOfPost/{postId}/{slideNumber}")
    @CrossOrigin({"http://localhost:8019"})
    public ResponseEntity<Map<String,Object>> getSingleSlideOfPost(@PathVariable String postId, @PathVariable int slideNumber) {
        Map<String, Object> output = new HashMap<String, Object>();
        Optional<UserPost> userPostsOptional = userPostRepository.findById(postId);

        if (userPostsOptional.isPresent()) {
            UserPost userPost = userPostsOptional.get();
            int[] userPostSlides = userPost.getSlides();
            for(int i=0; i<userPostSlides.length; i++) {
                if(userPostSlides[i]==slideNumber) {
                    output.put("imgData", userPost.getPosts()[i]);
                    return new ResponseEntity<>(output, HttpStatus.OK);
                }
                else if(userPostSlides[i]>slideNumber) {
                    break;
                }
            }
        }


        VideoMetadata[] videosMetadata = videoMetadataRepository.findByOverallPostId(postId);
        for(VideoMetadata vidMetadata: videosMetadata) {
            if(vidMetadata.getSlideNumber()==slideNumber) {
                output.put("videoId", vidMetadata.getVideoId());
                return new ResponseEntity<>(output, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>(output, HttpStatus.OK);
    }

    private boolean authTokenIsValidated(Connection connection, String authToken, String username) {
        String sql = "SELECT authTokenSalt, hashedAuthToken, authTokenExpiry  FROM userTokens WHERE username = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                String authTokenSalt = rs.getString("authTokenSalt");
                String hashedAuthToken = rs.getString("hashedAuthToken");
                Timestamp authTokenExpiry = rs.getTimestamp("authTokenExpiry");
                LocalDateTime expiryDateTime = authTokenExpiry.toLocalDateTime();
                if (expiryDateTime.isBefore(LocalDateTime.now())) {
                    return false;
                }
                String expectedHashedAuthToken = hashToken(authToken + authTokenSalt);
                return expectedHashedAuthToken.equals(hashedAuthToken);
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    private boolean refreshTokenIsValidated(Connection connection, String refreshToken, String username) {
        String sql = "SELECT refreshTokenSalt, hashedRefreshToken, refreshTokenExpiry FROM userTokens WHERE username = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                String refreshTokenSalt = rs.getString("refreshTokenSalt");
                String hashedRefreshToken = rs.getString("hashedRefreshToken");
                Timestamp refreshTokenExpiry = rs.getTimestamp("refreshTokenExpiry");
                LocalDateTime expiryDateTime = refreshTokenExpiry.toLocalDateTime();
                if (expiryDateTime.isBefore(LocalDateTime.now())) {
                    return false;
                }
                String expectedHashedRefreshToken = hashToken(refreshToken + refreshTokenSalt);
                return expectedHashedRefreshToken.equals(hashedRefreshToken);
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/cookies/authenticateUser/{username}")
    @CrossOrigin(origins = {"http://localhost:3100", "http://localhost:8007", "http://localhost:8011", "http://localhost:8019"}, allowCredentials = "true")
    public Boolean authenticateUser(@PathVariable String username, HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("authToken" + username)) {
                        String authToken = cookie.getValue();
                        Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
                        if (authTokenIsValidated(connection, authToken, username)) {
                            return true;
                        }
                        return false;
                    }
                }
            }
            return false;

        } catch (Exception e) {
            return false;
        }

    }

    @PostMapping("/cookies/updateAuthToken")
    @CrossOrigin(origins = {"http://localhost:3100", "http://localhost:8007", "http://localhost:8011", "http://localhost:8019"}, allowCredentials = "true")
    public String updateAuthToken(@RequestBody Map<String, String> request, HttpServletRequest servletRequest,
            HttpServletResponse response) throws Exception {
        if (request.containsKey("username")) {
            String username = request.get("username");
            Cookie[] cookies = servletRequest.getCookies();
            if (cookies == null) {
                return "Refresh token of username not found";
            }
            Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            boolean refreshTokenFound = false;
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken" + username)) {
                    refreshTokenFound = true;
                    if (refreshTokenIsValidated(connection, cookie.getValue(), username)) {
                        break;
                    } else {
                        return "Invalid refresh token for username";
                    }
                }
            }
            if (!refreshTokenFound) {
                return "Refresh token of username not found";
            }
            String newAuthToken = generateToken(100);
            String newAuthTokenSalt = generateToken(32);
            String newHashedAuthToken = hashToken(newAuthToken + newAuthTokenSalt);
            String newAuthTokenExpiry = getExpirationDate(45);
            String sql = "UPDATE userTokens SET hashedAuthToken = ?, authTokenSalt = ?, authTokenExpiry=? WHERE username = ?;";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, newHashedAuthToken);
                pstmt.setString(2, newAuthTokenSalt);
                pstmt.setString(3, newAuthTokenExpiry);
                pstmt.setString(4, username);
                pstmt.executeUpdate();
                Cookie cookie = new Cookie("authToken" + username, newAuthToken);
                cookie.setMaxAge(2628288);
                cookie.setPath("/cookies");
                cookie.setHttpOnly(true);
                response.addCookie(cookie);
                return "Cookie updated successfully";
            } catch (Exception e) {
                return "Auth token was not updated successfully";
            }
        } else {
            return "{\"error\": \"Invalid request\"}";
        }
    }

    @PostMapping("/cookies/updateRefreshToken")
    @CrossOrigin(origins = {"http://localhost:3100", "http://localhost:8007", "http://localhost:8011", "http://localhost:8019"}, allowCredentials = "true")
    public String updateRefreshToken(@RequestBody Map<String, String> request, HttpServletRequest servletRequest,
            HttpServletResponse response) throws Exception {
        if (request.containsKey("username")) {
            String username = request.get("username");
            Cookie[] cookies = servletRequest.getCookies();
            if (cookies == null) {
                return "Refresh token of username not found";
            }
            boolean refreshTokenFound = false;
            Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken" + username)) {
                    refreshTokenFound = true;
                    if (refreshTokenIsOutdated(connection, cookie.getValue(), username)) {
                        break;
                    } else {
                        return "Refresh token for username hasn't expired";
                    }
                }
            }
            if (!refreshTokenFound) {
                return "Refresh token of username not found";
            }
            String newRefreshToken = generateToken(100);
            String newRefreshTokenSalt = generateToken(32);
            String newHashedRefreshToken = hashToken(newRefreshToken + newRefreshTokenSalt);
            String newRefreshTokenExpiry = getExpirationDate(4320);
            String sql = "UPDATE userTokens SET hashedRefreshToken = ?, refreshTokenSalt = ?, refreshTokenExpiry=? WHERE username = ?;";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, newHashedRefreshToken);
                pstmt.setString(2, newRefreshTokenSalt);
                pstmt.setString(3, newRefreshTokenExpiry);
                pstmt.setString(4, username);
                pstmt.executeUpdate();
                Cookie cookie = new Cookie("refreshToken" + username, newRefreshToken);
                cookie.setMaxAge(2628288);
                cookie.setPath("/cookies");
                cookie.setHttpOnly(true);
                response.addCookie(cookie);
                return "Cookie updated successfully";
            } catch (Exception e) {
                return "Refresh token was not updated successfully";
            }
        } else {
            return "{\"error\": \"Invalid request\"}";
        }
    }

    private boolean refreshTokenIsOutdated(Connection connection, String refreshToken, String username) {
        String sql = "SELECT refreshTokenExpiry FROM userTokens WHERE refreshToken=?, username=?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Timestamp refreshTokenExpiry = rs.getTimestamp("refreshTokenExpiry");
                LocalDateTime expiryDateTime = refreshTokenExpiry.toLocalDateTime();
                if (expiryDateTime.isBefore(LocalDateTime.now())) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping("/cookies/removeTokens")
    @CrossOrigin(origins = "http://localhost:3100", allowCredentials = "true")
    public String removeTokens(@RequestBody Map<String, String> request, HttpServletResponse response) {
        if (request.containsKey("username")) {
            String username = request.get("username");
            Cookie cookie = new Cookie("authToken" + username, null);
            cookie.setMaxAge(0);
            cookie.setPath("/cookies");
            response.addCookie(cookie);
            Cookie cookie2 = new Cookie("refreshToken" + username, null);
            cookie2.setMaxAge(0);
            cookie2.setPath("/cookies");
            response.addCookie(cookie2);
            return "Successfully logged out";
        } else {
            return "Username not provided";
        }

    }

    @PostMapping("/cookies/getTokensAfterLogin")
    @CrossOrigin(origins = "http://localhost:8000", allowCredentials = "true")
    public String getTokensAfterLogin(@RequestBody Map<String, String> request, HttpServletRequest request2,
            HttpServletResponse response) {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            if (request.containsKey("username")) {
                String username = request.get("username");
                String authToken = generateToken(100);
                String refreshToken = generateToken(100);
                String authTokenSalt = generateToken(32);
                String refreshTokenSalt = generateToken(32);
                String authTokenExpiry = getExpirationDate(45);
                String refreshTokenExpiry = getExpirationDate(4320);
                String hashedAuthToken = hashToken(authToken + authTokenSalt);
                String hashedRefreshToken = hashToken(refreshToken + refreshTokenSalt);

                updateDatabaseAfterLogin(connection, username, hashedAuthToken, hashedRefreshToken, authTokenSalt,
                        refreshTokenSalt, authTokenExpiry,
                        refreshTokenExpiry);

                Cookie cookie = new Cookie("authToken" + username, authToken);
                cookie.setMaxAge(2628288);
                cookie.setPath("/cookies");
                cookie.setHttpOnly(true);

                Cookie cookie2 = new Cookie("refreshToken" + username, refreshToken);
                cookie2.setMaxAge(2628288);
                cookie2.setPath("/cookies");
                cookie2.setHttpOnly(true);

                response.addCookie(cookie);
                response.addCookie(cookie2);

                return "Cookies set successfully";
            } else {
                return "{\"error\": \"Invalid request\"}";
            }

        } catch (Exception e) {
            return "{\"error\": \"Internal server error\"}";
        }
    }

    private void updateDatabaseAfterLogin(Connection connection, String username, String hashedAuthToken,
            String hashedRefreshToken, String authTokenSalt, String refreshTokenSalt, String authTokenExpiry,
            String refreshTokenExpiry) throws Exception {
        String sql = "UPDATE userTokens SET hashedAuthToken=?, hashedRefreshToken=?, authTokenSalt=?, refreshTokenSalt=?, authTokenExpiry=?, refreshTokenExpiry=? WHERE username = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, hashedAuthToken);
            pstmt.setString(2, hashedRefreshToken);
            pstmt.setString(3, authTokenSalt);
            pstmt.setString(4, refreshTokenSalt);
            pstmt.setString(5, authTokenExpiry);
            pstmt.setString(6, refreshTokenExpiry);
            pstmt.setString(7, username);
            pstmt.executeUpdate();
        }
    }

}