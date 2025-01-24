package com.megagram.springBootBackend1;

import com.megagram.springBootBackend1.mysqlModels.User;
import com.megagram.springBootBackend1.mysqlRepositories.UserRepository;
import com.megagram.springBootBackend1.psqlModels.PasswordResetToken;
import com.megagram.springBootBackend1.psqlRepositories.PasswordResetTokenRepository;

import java.io.IOException;
import java.io.StringWriter;
import java.io.PrintWriter;
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
import java.util.regex.Pattern;
import java.util.Set;
import java.util.List;

import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import redis.clients.jedis.UnifiedJedis;
import redis.clients.jedis.DefaultJedisClientConfig;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisClientConfig;

import com.alibaba.fastjson.JSON;

import com.google.cloud.kms.v1.CryptoKeyName;
import com.google.cloud.kms.v1.KeyManagementServiceClient;
import com.google.cloud.kms.v1.DecryptResponse;
import com.google.protobuf.ByteString;

import com.google.cloud.spanner.DatabaseId;
import com.google.cloud.spanner.Spanner;
import com.google.cloud.spanner.SpannerOptions;
import com.google.cloud.spanner.DatabaseClient;

import org.mindrot.jbcrypt.BCrypt;


@RestController
public class BackendController {

    private final String twilioAccountSid = System.getenv("TWILIO_ACCOUNT_SID");
    private final String twilioAuthToken = System.getenv("TWILIO_AUTH_TOKEN");
    private final String twilioPhoneNumber = System.getenv("TWILIO_PHONE_NUMBER");
    private final String emailSenderAuthToken = System.getenv("EMAIL_SENDER_AUTH_TOKEN");
    private final String awsRedisPassword = System.getenv("AWS_REDIS_PASSWORD");

    private final SecureRandom secureRandom = new SecureRandom();
    private final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();
    private final JedisClientConfig redisConfig = DefaultJedisClientConfig.builder()
        .user("rishavry")
        .password(awsRedisPassword)
        .build();

    private final UnifiedJedis redisClient = new UnifiedJedis(
        new HostAndPort("redis-14251.c261.us-east-1-4.ec2.redns.redis-cloud.com", 14251),
        redisConfig
    );
    //private final KeyManagementServiceClient gcKMSClient = KeyManagementServiceClient.create();
    private final Properties props = System.getProperties();

    private Session session;
    private Transport transport;
    private DatabaseClient gcSpannerMySQLClient;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

     public BackendController() throws Exception {
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.user", "megagram664@gmail.com");
        props.put("mail.smtp.password", emailSenderAuthToken);
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        session = Session.getDefaultInstance(props);
        transport = session.getTransport("smtp");
        transport.connect("smtp.gmail.com", "megagram664@gmail.com", emailSenderAuthToken);

        /* Commented out for Now
        Twilio.init(twilioAccountSid, twilioAuthToken); 

        SpannerOptions options = SpannerOptions.newBuilder().build();
        Spanner spanner = options.getService();
        DatabaseId db = DatabaseId.of("megagram-428802", "mg-ms-sp", "megagram");
        gcSpannerMySQLClient = spanner.getDatabaseClient(db);
        */
    }


    @PostMapping("/sendLinkForSettingNewPassword")
    @CrossOrigin({"http://34.111.89.101", "http://localhost:8002"})
    public ResponseEntity<String> sendLinkForSettingNewPassword(@RequestBody Map<String, String> request) {
        if (request.containsKey("email")) {
            String email = request.get("email");
            String username = getUsernameFromContactInfo(email);
            if (username != null) {
                if(username.equals("testuser")) {
                    return new ResponseEntity<String>(
                        "@testuser cannot set a new username or password", HttpStatus.INTERNAL_SERVER_ERROR
                    ); 
                }
                try {
                    String passwordResetToken = generateNewPasswordResetToken(username);
                    sendEmail(email, username, passwordResetToken);
                    return new ResponseEntity<String>("Success", HttpStatus.OK);
                }
                catch (Exception e) {
                    return new ResponseEntity<String>(
                        getExceptionStackTraceAsString(e), HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }
            return new ResponseEntity<String>("User not found with that email", HttpStatus.NOT_FOUND);
        }
        else if (request.containsKey("number")) {
            String number = request.get("number");
            String username = getUsernameFromContactInfo(number);
            if (username != null) {
                if(username.equals("testuser")) {
                    return new ResponseEntity<String>(
                        "@testuser cannot set a new username or password", HttpStatus.INTERNAL_SERVER_ERROR
                    ); 
                }
                try {
                    String passwordResetToken = generateNewPasswordResetToken(username);
                    sendSMS(number, username, passwordResetToken);
                    return new ResponseEntity<String>("Success", HttpStatus.OK);
                }
                catch (Exception e) {
                    return new ResponseEntity<String>(
                        getExceptionStackTraceAsString(e), HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }
            return new ResponseEntity<String>("User not found with that number", HttpStatus.NOT_FOUND);
        }
        else if (request.containsKey("username")) {
            String username = request.get("username");
            if(username.equals("testuser")) {
                return new ResponseEntity<String>(
                    "@testuser cannot set a new username or password", HttpStatus.INTERNAL_SERVER_ERROR
                ); 
            }
            String contactInfo = getContactInfoFromUsername(username);
            if (contactInfo != null) {
                try {
                    String passwordResetToken = generateNewPasswordResetToken(username);
                    if (contactInfo.contains("@")) {
                        sendEmail(contactInfo, username, passwordResetToken);
                    } else {
                        sendSMS(contactInfo, username, passwordResetToken);
                    }
                    return new ResponseEntity<String>("Success", HttpStatus.OK);
                }
                catch (Exception e) {
                    return new ResponseEntity<String>(
                        getExceptionStackTraceAsString(e), HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }
            return new ResponseEntity<String>("User not found with that username", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<String>(
            "The request must contain one of the following keys: 'email', 'number', or 'username'",
            HttpStatus.BAD_REQUEST
        );
    }

    @PatchMapping("/resetPassword/{username}/{passwordResetToken}")
    @CrossOrigin({"http://34.111.89.101", "http://localhost:8002"})
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request,
    @PathVariable String username, @PathVariable String passwordResetToken) throws NoSuchAlgorithmException {
        if(username.equals("testuser")) {
            return new ResponseEntity<String>(
                "@testuser cannot set a new username or password", HttpStatus.INTERNAL_SERVER_ERROR
            ); 
        }
        if (request.containsKey("newPassword")) {
            String newPassword = request.get("newPassword");
            if (passwordInputIsStrongEnough(newPassword)) {
                int userId = getUserIdFromUsername(username);
                List<PasswordResetToken> passwordResetTokensOfUser = passwordResetTokenRepository.findByUserId(userId);
                for(PasswordResetToken prt : passwordResetTokensOfUser) {
                    if (prt.getExpiration().isAfter(LocalDateTime.now())) {
                        String salt = prt.getSalt();
                        String hashedToken = prt.getHashedToken();
                        String givenHashedToken = hashToken(passwordResetToken+salt);
                        if (givenHashedToken.equals(hashedToken)) {
                            String newPasswordSalt = BCrypt.gensalt();
                            String newHashedPassword = BCrypt.hashpw(newPassword, newPasswordSalt);

                            Optional<User> optionalUserToResetPassword = userRepository.findById(userId);
                            if (optionalUserToResetPassword.isPresent()) {
                                User userToResetPassword = optionalUserToResetPassword.get();
                                userToResetPassword.setSalt(newPasswordSalt);
                                userToResetPassword.setHashedPassword(newHashedPassword);
                                userRepository.save(userToResetPassword);
                                return new ResponseEntity<String>("Success", HttpStatus.OK);
                            }
                        }
                    }
                }
                return new ResponseEntity<String>("Password-reset-token is invalid", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<String>("Password is too weak", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<String>(
            "The request must contain the key 'newPassword'", HttpStatus.BAD_REQUEST
        );
    }


    private String getUsernameFromContactInfo(String contactInfo) {
        Map<String, String> infoOfEachUser = redisClient.hgetAll("Usernames and their Info");
        for (Map.Entry<String, String> info : infoOfEachUser.entrySet()) {
            String username = info.getKey();
            String stringifiedUserInfo = info.getValue();

            Map<String, Object> userInfo = JSON.parseObject(stringifiedUserInfo, Map.class);
            int userId = (int) userInfo.get("id");
            String encryptedContactInfo = (String) userInfo.get("contact_info");
            String decryptedContactInfo = decryptDataWithGCKMS(
                "megagram-428802", "global", "usersTableMySQL", Integer.toString(userId), encryptedContactInfo
            );
            if(contactInfo.equals(decryptedContactInfo)) {
                return username;
            }
        }
        return null;
    }

    private String getContactInfoFromUsername(String username) {
        String stringifiedUserInfo = redisClient.hget("Usernames and their Info", username);
        if(stringifiedUserInfo == null) {
            return null;
        }
        else {
            Map<String, Object> userInfo = JSON.parseObject(stringifiedUserInfo, Map.class);
            int userId = (int) userInfo.get("id");
            String encryptedContactInfo = (String) userInfo.get("contact_info");
            String decryptedContactInfo = decryptDataWithGCKMS(
                "megagram-428802", "global", "usersTableMySQL", Integer.toString(userId), encryptedContactInfo
            );
            return decryptedContactInfo;
        }
    }

    private Integer getUserIdFromUsername(String username) {    
        String stringifiedUserInfo = redisClient.hget("Usernames and their Info", username);
        if(stringifiedUserInfo == null) {
            return null;
        }
        else {
            Map<String, Object> userInfo = JSON.parseObject(stringifiedUserInfo, Map.class);
            Integer userId = (Integer) userInfo.get("id");
            return userId;
        }
    }

    private String generateNewPasswordResetToken(String username) throws NoSuchAlgorithmException {
        Integer userId  = getUserIdFromUsername(username);
        String salt = generateToken(22);
        String token = generateToken(100);
        String hashedToken = hashToken(token+salt);
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(30);

        PasswordResetToken newPasswordResetToken = new PasswordResetToken(userId, salt, hashedToken, expiration);
        passwordResetTokenRepository.save(newPasswordResetToken);

        return token;
    }

    private void sendEmail(String email, String username, String passwordResetToken) throws Exception {
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress("megagram664@gmail.com"));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        message.setSubject(username + ", we've made it easy to get back to Megagram");

        String htmlContent = String.format(
        """
            <html>
            <body>
                <img src="https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg"
                alt="image1" style="height:13em; width: 16em; object-fit: contain; margin-left:650px;">
                <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg" alt="image2"
                style="height:13em; width: 16em; object-fit: contain;">
                <div style="width: 560px; font-family:Arial; line-height:1.4; font-size:1.3em; margin-left: 630px;
                color: #484a49">
                    <p>Hi %s,</p>
                    <p>
                        Sorry to hear you're having trouble logging into Megagram. It seems that you forgot your
                        password. If you really did, you can reset your password within the next 30 minutes.
                    </p>
                    <a href="http://34.111.89.101/reset-password/setNewPassword/%s/%s" style="background-color: #6fa3f7;
                    color: white; display: inline-block; text-align: center; width: 595px; height: 44px;
                    border-radius: 7px; border: none; font-weight: bold; padding-top:24px; font-size: 17.7px;
                    margin-top: 18px; text-decoration: none; cursor: pointer;">
                        Reset your password
                    </a>
                    <p>If you didn't request a login link or a password reset, you can ignore this message.
                        Otherwise, click the button above to start the process of regaining access to your account!
                    </p>
                    
                    <small style="color: #b3b5b4;">
                        This message was emailed to you automatically, and replies to this email-address will neither
                        be replied to nor read.
                    </small>
                </div>
                
            </body>
            </html>
        """,
        username, username, passwordResetToken);

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(htmlContent, "text/html");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        message.setContent(multipart);

        transport.sendMessage(message, message.getAllRecipients());
    }

    private void sendSMS(String number, String username, String passwordResetToken) {
        String messageBody = String.format(
        """
            Megagram Account Recovery\n\n
            Hi %s,\n
            Sorry to hear you're having trouble logging into Megagram. It seems that you forgot your
            password. If you really did, you can reset your password anytime between now and the next 30 min.
            If you didn't request a login link or a password reset, you can ignore this message.
            To reset your password click this link: http://34.111.89.101/reset-password/setNewPassword/%s/%s.
            This message was texted to you automatically, and replies to this number will neither be replied to nor
            read.
        """,
        username, username, passwordResetToken);

        com.twilio.rest.api.v2010.account.Message.creator(
            new PhoneNumber(number), new PhoneNumber(twilioPhoneNumber), messageBody
        ).create();
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

    private String decryptDataWithGCKMS(String projectId, String locationId, String keyRingId, String keyId,
    String encryptedData) {
        String keyName = CryptoKeyName.format(projectId, locationId, keyRingId, keyId);
        ByteString ciphertext = ByteString.copyFrom(Base64.getDecoder().decode(encryptedData));
        /*
        DecryptResponse response = gcKMSClient.decrypt(keyName, ciphertext);
        String plaintext = response.getPlaintext().toStringUtf8();
        return plaintext;
        */
        return "Hello";
    }


    private Boolean passwordInputIsStrongEnough(String passwordInput) {
        if (passwordInput == null) {
            return false;
        }

        double lengthWeight = 0.6;
        double varietyWeight = 0.4;

        double lengthScore = Math.min((double) passwordInput.length() / 20, 1.0);

        double varietyScore = 0.0;
        if (Pattern.compile("[a-z]").matcher(passwordInput).find()) {
            varietyScore += 0.25;
        }
        if (Pattern.compile("[A-Z]").matcher(passwordInput).find()) {
            varietyScore += 0.25;
        }
        if (Pattern.compile("[0-9]").matcher(passwordInput).find()) {
            varietyScore += 0.25;
        }
        if (Pattern.compile("[^a-zA-Z0-9]").matcher(passwordInput).find()) {
            varietyScore += 0.25;
        }

        double strengthScore = (lengthWeight * lengthScore) + (varietyWeight * varietyScore);

        return strengthScore >= 0.65;
    }

    private String getExceptionStackTraceAsString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

}