package com.dog.controller;

import com.dog.dto.request.Auth.LoginRequest;
import com.dog.dto.request.User.RegisterRequest;
import com.dog.dto.response.JwtResponse;
import com.dog.dto.response.UserResponse;
import com.dog.security.JwtUtil;
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

    // --- CAMBIO 1: Declaramos las dependencias como 'final' y sin @Autowired aquí ---
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    // --- CAMBIO 2: Creamos un constructor que recibe todas las dependencias ---
    // Spring usará este constructor para inyectar los beans necesarios.
    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    // El resto del código se mantiene igual
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
        // Esta línea ya no dará error porque 'userService' está garantizado que no será null.
        UserResponse createdUser = userService.registerUser(registerRequest);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}