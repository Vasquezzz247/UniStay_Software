// src/main/java/com/dog/service/impl/UserDetailsServiceImpl.java

package com.dog.service.impl;

import com.dog.entities.User;
import com.dog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Buscamos al usuario por su email.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No se encontró un usuario con el email: " + email));

        // 2. Mapeamos el CONJUNTO de roles del usuario a un CONJUNTO de GrantedAuthority.
        // Spring Security necesita este formato para funcionar.
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRole().toUpperCase()))
                .collect(Collectors.toSet());
        System.out.println("Usuario '" + email + "' tiene los siguientes roles para Spring Security: " + authorities);

        // 3. Devolvemos el objeto UserDetails con los permisos cargados.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
