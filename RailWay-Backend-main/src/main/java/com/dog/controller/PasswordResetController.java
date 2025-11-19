package com.dog.controller;

import com.dog.dto.request.Auth.ForgotPasswordRequest;
import com.dog.dto.request.Auth.ResetPasswordRequest;
import com.dog.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://unistayf.netlify.app"
})
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.sendPasswordResetToken(request.getEmail());

        // Siempre respondemos lo mismo, exista o no el email (evitar enumeration)
        return ResponseEntity.ok(
                Map.of("message",
                        "Si el correo existe en nuestro sistema, se ha enviado un enlace para restablecer la contraseña.")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

        return ResponseEntity.ok(
                Map.of("message", "La contraseña ha sido actualizada correctamente.")
        );
    }
}
