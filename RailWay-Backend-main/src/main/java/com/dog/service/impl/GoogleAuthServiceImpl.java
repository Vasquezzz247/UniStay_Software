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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

        // ========== 2. Buscar o crear usuario ==========
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "Usuario Google");
            newUser.setLastName("");
            // Como la columna es NOT NULL, dejamos password vacío
            newUser.setPassword("");

            // ⚠️ Asegúrate que en la tabla roles exista EXACTAMENTE "ESTUDIANTE"
            Role defaultRole = roleRepository.findByRole("ESTUDIANTE")
                    .orElseThrow(() -> new RuntimeException("Rol 'ESTUDIANTE' no encontrado"));

            newUser.getRoles().add(defaultRole);
            System.out.println("[GOOGLE] Creando usuario nuevo con rol: " + defaultRole.getRole());
            return userRepository.save(newUser);
        });

        // 2.1 Si el usuario EXISTE pero NO tiene roles → le ponemos ESTUDIANTE
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByRole("ESTUDIANTE")
                    .orElseThrow(() -> new RuntimeException("Rol 'ESTUDIANTE' no encontrado"));
            user.getRoles().add(defaultRole);
            user = userRepository.save(user);
            System.out.println("[GOOGLE] Usuario existente sin roles, asignado: " + defaultRole.getRole());
        }

        System.out.println("[GOOGLE] Roles del usuario en BD: " +
                user.getRoles().stream().map(Role::getRole).toList()
        );

        // ========== 3. Convertir roles a authorities ==========
        // Metemos *dos* authorities por rol: "ESTUDIANTE" y "ROLE_ESTUDIANTE"
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .flatMap(r -> Stream.of(
                        new SimpleGrantedAuthority(r.getRole()),
                        new SimpleGrantedAuthority("ROLE_" + r.getRole())
                ))
                .collect(Collectors.toList());

        System.out.println("[GOOGLE] Authorities del token: " + authorities);

        // ========== 4. Crear UserDetails para el JWT ==========
        UserDetails principal = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password("") // no usamos password aquí
                .authorities(authorities)
                .build();

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