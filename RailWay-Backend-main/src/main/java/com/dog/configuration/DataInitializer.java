// src/main/java/com/dog/configuration/DataInitializer.java

package com.dog.configuration;

import com.dog.entities.Role;
import com.dog.entities.User;
import com.dog.repository.RoleRepository;
import com.dog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

//@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional // Usamos @Transactional para asegurar la consistencia de los datos
    public void run(String... args) throws Exception {

        System.out.println(">>> Asegurando la existencia de roles básicos...");
        Role adminRole = roleRepository.findByRole("ADMIN").orElseGet(() -> roleRepository.save(Role.builder().role("ADMIN").build()));
        Role propietarioRole = roleRepository.findByRole("PROPIETARIO").orElseGet(() -> roleRepository.save(Role.builder().role("PROPIETARIO").build()));
        Role estudianteRole = roleRepository.findByRole("ESTUDIANTE").orElseGet(() -> roleRepository.save(Role.builder().role("ESTUDIANTE").build()));

        // --- LÓGICA DE REPARACIÓN Y CREACIÓN DEL USUARIO ADMIN ---
        Optional<User> adminUserOpt = userRepository.findByEmail("Claudia@gmail.com");

        if (adminUserOpt.isPresent()) {
            // Si el usuario ya existe, nos aseguramos de que tenga los roles correctos.
            System.out.println(">>> Usuario 'Claudia@gmail.com' encontrado. Verificando roles...");
            User adminUser = adminUserOpt.get();
            boolean needsUpdate = false;
            if (!adminUser.getRoles().contains(adminRole)) {
                adminUser.getRoles().add(adminRole);
                needsUpdate = true;
            }
            if (!adminUser.getRoles().contains(propietarioRole)) {
                adminUser.getRoles().add(propietarioRole);
                needsUpdate = true;
            }
            if(needsUpdate) {
                userRepository.save(adminUser);
                System.out.println(">>> Roles de 'Claudia@gmail.com' actualizados a ADMIN y PROPIETARIO.");
            }
        } else {
            // Si no existe, lo creamos desde cero con los roles correctos.
            System.out.println(">>> Creando usuario Admin de prueba 'Claudia@gmail.com'...");
            User adminUser = User.builder()
                    .name("Claudia")
                    .lastName("Admin")
                    .email("Claudia@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole, propietarioRole))
                    .build();
            userRepository.save(adminUser);
            System.out.println(">>> Usuario Admin de prueba creado.");
        }

        // --- (Opcional) Puedes mantener tu lógica de revisión para otros usuarios ---
        // ...
    }
}
