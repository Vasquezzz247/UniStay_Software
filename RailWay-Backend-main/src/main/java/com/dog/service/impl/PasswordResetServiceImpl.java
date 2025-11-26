package com.dog.service.impl;

import com.dog.entities.PasswordResetToken;
import com.dog.entities.User;
import com.dog.repository.PasswordResetTokenRepository;
import com.dog.repository.UserRepository;
import com.dog.service.EmailService;
import com.dog.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    // nuevo: usamos la interfaz genérica de correo
    private final EmailService emailService;

    // URL base del frontend (para armar el link del correo)
    @Value("${unistay.frontend.base-url:https://uni-stay-software.vercel.app}")
    private String frontendBaseUrl;

    // Validez del token (ej: 30 minutos)
    private static final long EXPIRATION_MINUTES = 30L;

    @Override
    @Transactional
    public void sendPasswordResetToken(String email) {
        // No revelamos si el correo existe o no al cliente (seguridad).
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("[FORGOT PASSWORD] Email no registrado: " + email);
            return;
        }

        User user = userOpt.get();

        // Generar token aleatorio
        String tokenValue = UUID.randomUUID().toString();

        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
                .used(false)
                .build();

        tokenRepository.save(token);

        // Construir link para el frontend
        String resetLink = frontendBaseUrl + "/reset-password?token=" + tokenValue;

        sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    @Override
    @Transactional
    public void resetPassword(String tokenValue, String newPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido."));

        if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El token ha expirado o ya fue utilizado.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    // ---- Email helpers ----

    private void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "Restablece tu contraseña - UniStay";

        String body =
                "Hemos recibido una solicitud para restablecer tu contraseña en UniStay.\n\n" +
                        "Si fuiste tú, haz clic en el siguiente enlace o cópialo en tu navegador:\n" +
                        resetLink + "\n\n" +
                        "Este enlace es válido por " + EXPIRATION_MINUTES + " minutos.\n\n" +
                        "Si no solicitaste este cambio, puedes ignorar este mensaje.\n\n" +
                        "Este mensaje es automático. No respondas a este correo.";

        emailService.sendEmail(toEmail, subject, body);
    }
}