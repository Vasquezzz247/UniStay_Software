package com.dog.service.impl;

import com.dog.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class MailerSendEmailServiceImpl implements EmailService {

    @Value("${mailersend.api.token}")
    private String apiToken;

    @Value("${mailersend.from.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendEmail(String toEmail, String subject, String textContent) {
        String url = "https://api.mailersend.com/v1/email";

        // Body según docs de MailerSend
        Map<String, Object> body = Map.of(
                "from", Map.of("email", fromEmail),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "text", textContent
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiToken);
        headers.set("X-Requested-With", "XMLHttpRequest");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            System.out.println("[MAILERSEND] Status: " + response.getStatusCode());
            System.out.println("[MAILERSEND] Body: " + response.getBody());
        } catch (Exception e) {
            System.err.println("[MAILERSEND] Error enviando correo: " + e.getMessage());
            throw new RuntimeException("Error enviando correo con MailerSend", e);
        }
    }
}
