package com.dog.service.impl;

import com.dog.dto.request.User.RegisterRequest;
import com.dog.dto.request.User.UserRequest;
import com.dog.dto.request.User.UserUpdateRequest;
import com.dog.dto.response.UserResponse;
import com.dog.entities.Role;
import com.dog.entities.User;
import com.dog.exception.EmailAlreadyExistsException;
import com.dog.exception.RoleNotFoundException;
import com.dog.exception.UserNotFoundException;
import com.dog.repository.RoleRepository;
import com.dog.repository.UserRepository;
import com.dog.service.UserService;
import com.dog.utils.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return UserMapper.toDTOList(userRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + id));
    }

    // Método para creación administrativa
    @Override
    @Transactional
    public UserResponse save(UserRequest userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email " + userRequest.getEmail() + " ya está en uso.");
        }

        Role role = roleRepository.findById(UUID.fromString(userRequest.getRole()))
                .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado."));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        // Creamos la entidad usando el builder. El mapper ya no es necesario aquí.
        User newUser = User.builder()
                .name(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .password(null) // La contraseña se debe manejar de forma segura, no desde este DTO
                .roles(roles)
                .build();

        return UserMapper.toDTO(userRepository.save(newUser));
    }

    @Override
    @Transactional
    public UserResponse update(UserUpdateRequest userUpdateRequest) {
        User existingUser = userRepository.findById(userUpdateRequest.getUserId())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado para actualizar."));

        existingUser.setName(userUpdateRequest.getFirstName());
        existingUser.setLastName(userUpdateRequest.getLastName());

        // Lógica para actualizar el rol si viene en el DTO
        if (userUpdateRequest.getRole() != null && !userUpdateRequest.getRole().isEmpty()) {
            Role role = roleRepository.findById(UUID.fromString(userUpdateRequest.getRole()))
                    .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado."));
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            existingUser.setRoles(roles);
        }

        return UserMapper.toDTO(userRepository.save(existingUser));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuario no encontrado para eliminar.");
        }
        userRepository.deleteById(id);
    }

    // Lógica de registro público
    @Override
    @Transactional
    public UserResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email " + registerRequest.getEmail() + " ya está registrado.");
        }

        String roleName = registerRequest.getUserType().name();
        Role userRole = roleRepository.findByRole(roleName)
                .orElseThrow(() -> new RoleNotFoundException("El rol por defecto '" + roleName + "' no se encuentra."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User newUser = new User();
        newUser.setName(registerRequest.getFirstName());
        newUser.setLastName(registerRequest.getLastName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRoles(roles);

        User savedUser = userRepository.save(newUser);
        return UserMapper.toDTO(savedUser);
    }
}
