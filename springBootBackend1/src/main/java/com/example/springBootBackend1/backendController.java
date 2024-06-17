package com.example.springBootBackend1;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class backendController {

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

    @PostMapping("/getTokens")
    @CrossOrigin(origins = "http://localhost:8000")
    public String getTokens(@RequestBody Map<String, String> request) {
        try (Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
            if (request.containsKey("username")) {
                String username = request.get("username");
                String authToken = generateToken(113);
                String refreshToken = generateToken(113);

                String authTokenExpiry = getExpirationDate(45);
                String refreshTokenExpiry = getExpirationDate(4320);

                String hashedAuthToken = hashToken(authToken);
                String hashedRefreshToken = hashToken(refreshToken);

                updateDatabase(connection, username, hashedAuthToken, hashedRefreshToken, authTokenExpiry,
                        refreshTokenExpiry);
                return "{\"token\": \"" + authToken + "\", \"refreshToken\": \"" + refreshToken + "\"}";
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
            String hashedRefreshToken, String authTokenExpiry, String refreshTokenExpiry) throws Exception {
        String sql = "INSERT INTO userTokens (username, authToken, refreshToken, authTokenExpiry, refreshTokenExpiry) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, hashedAuthToken);
            pstmt.setString(3, hashedRefreshToken);
            pstmt.setString(4, authTokenExpiry);
            pstmt.setString(5, refreshTokenExpiry);
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

    @GetMapping("/set-tokens")
    @CrossOrigin(origins = "http://localhost:8000")
    public String setTokens(HttpServletResponse response, @RequestHeader("Auth-Token") String authToken,
            @RequestHeader("Refresh-Token") String refreshToken) {
        ResponseCookie authTokenCookie = ResponseCookie.from("authToken", authToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(10 * 365 * 24 * 60 * 60)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(10 * 365 * 24 * 60 * 60)
                .build();

        // Add cookies to the response
        response.addHeader("Set-Cookie", authTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        return "HttpOnly cookies set";
    }
}