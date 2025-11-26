package com.dog.service;

public interface EmailService {

    void sendEmail(String toEmail, String subject, String textContent);

}