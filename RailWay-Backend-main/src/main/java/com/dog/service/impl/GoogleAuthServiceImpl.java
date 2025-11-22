// src/main/java/com/dog/service/impl/GoogleAuthServiceImpl.java
package com.dog.service.impl;

import com.dog.entities.Role;
import com.dog.entities.User;
import com.dog.repository.RoleRepository;
import com.dog.repository.UserRepository;
import com.dog.security.JwtUtil;
import com.dog.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;   // 👈 IMPORTANTE
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoogleAuthServiceImpl implements GoogleAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    @Value("${google.oauth.client-id}")
    private String googleClientId;

    @Override
    public String authenticateWithGoogle(String idTokenString) throws Exception {
        System.out.println("googleClientId (BACK): " + googleClientId);

        if (idTokenString == null || idTokenString.isBlank()) {
            throw new IllegalArgumentException("idToken es requerido");
        }

        // ========== 1. Verificar token con Google ==========
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new IllegalArgumentException("Token de Google inválido");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Token no contiene email válido");
        }

        // ========== 2. Crear usuario si no existe ==========
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "Usuario Google");
            newUser.setLastName("");

            Role defaultRole = roleRepository.findByRole("ESTUDIANTE")
                    .orElseThrow(() -> new RuntimeException("Rol 'ESTUDIANTE' no encontrado"));

            newUser.getRoles().add(defaultRole);
            return userRepository.save(newUser);
        });

        // ========== 3. Convertir roles a authorities ==========
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getRole()))
                .collect(Collectors.toList());

        // ========== 4. Crear UserDetails para el JWT ==========
        // OJO: tenemos com.dog.entities.User, así que uso el nombre completo
        UserDetails principal = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password("")                // no usamos la password aquí
                .authorities(authorities)
                .build();

        // Ahora el principal ES un UserDetails, igual que en el login normal
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                );

        // ========== 5. Generar JWT ==========
        return jwtUtil.generateJwtToken(authToken);
    }
}