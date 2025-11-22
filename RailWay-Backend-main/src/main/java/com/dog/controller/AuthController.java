package com.dog.controller;

import com.dog.dto.request.Auth.GoogleLoginRequest;
import com.dog.dto.request.Auth.LoginRequest;
import com.dog.dto.request.User.RegisterRequest;
import com.dog.dto.response.JwtResponse;
import com.dog.dto.response.UserResponse;
import com.dog.security.JwtUtil;
import com.dog.service.GoogleAuthService;
import com.dog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = ("http://localhost:5173"))
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final GoogleAuthService googleAuthService; // ⬅️ NUEVO

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserService userService,
                          GoogleAuthService googleAuthService) { // ⬅️ NUEVO
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);
        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse createdUser = userService.registerUser(registerRequest);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // src/main/java/com/dog/controller/AuthController.java

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            String token = googleAuthService.authenticateWithGoogle(googleLoginRequest.getIdToken());
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (IllegalArgumentException ex) {
            // Token faltante o claramente inválido
            ex.printStackTrace(); // <-- LOG
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace(); // <-- LOG COMPLETO EN CONSOLA
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error Google: " + ex.getMessage());
        }
    }
}