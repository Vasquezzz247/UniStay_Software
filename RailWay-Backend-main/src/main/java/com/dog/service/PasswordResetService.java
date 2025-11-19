package com.dog.service;

public interface PasswordResetService {

    void sendPasswordResetToken(String email);

    void resetPassword(String token, String newPassword);
}
