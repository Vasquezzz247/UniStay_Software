package com.dog.service.impl;

import com.dog.dto.request.Role.RoleRequest;
import com.dog.dto.request.Role.RoleUpdateRequest;
import com.dog.dto.response.RoleResponse;
import com.dog.entities.Role;
import com.dog.exception.RoleAlreadyExistsException;
import com.dog.exception.RoleInUseException;
import com.dog.exception.RoleNotFoundException;
import com.dog.repository.RoleRepository;
import com.dog.repository.UserRepository;
import com.dog.service.RoleService;
import com.dog.utils.mappers.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<RoleResponse> findAll() {
        return roleRepository.findAll()
                .stream()
                .map(RoleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse findById(UUID id) {
        return RoleMapper.toDTO(roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado con id: " + id)));
    }
@Override
    @Transactional
    public RoleResponse save(RoleRequest roleRequest) {
        // 1. Extraemos el nombre del rol del DTO
        String roleName = roleRequest.getRoleName().toUpperCase(); // Convertimos a mayúsculas para consistencia

        // 2. VALIDACIÓN: Usamos el repositorio para ver si un rol con ese nombre ya existe
        if (roleRepository.findByRole(roleName).isPresent()) {
            // Si el Optional contiene algo, significa que el rol ya existe. Lanzamos un error.
            throw new RoleAlreadyExistsException("El rol '" + roleName + "' ya existe.");
        }

        // 3. Si no existe, procedemos a crear y guardar el nuevo rol.
        Role newRole = new Role();
        newRole.setRole(roleName);

        return RoleMapper.toDTO(roleRepository.save(newRole));
    }

    @Override
    @Transactional
    public RoleResponse update(RoleUpdateRequest roleUpdateRequest) {

        Role roleToUpdate = roleRepository.findById(roleUpdateRequest.getRoleId())
                .orElseThrow(() -> new RoleNotFoundException("No se puede actualizar. Rol no encontrado con id: " + roleUpdateRequest.getRoleId()));
        roleToUpdate.setRole(roleUpdateRequest.getRoleName());
        return RoleMapper.toDTO(roleRepository.save(roleToUpdate));
    }


    @Override
    @Transactional
    public void delete(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new RoleNotFoundException("No se puede borrar. Rol no encontrado con id: " + id);
        }

        long usersWithRole = userRepository.countByRoles_Id(id);
        if (usersWithRole > 0) {
            throw new RoleInUseException("El rol no puede ser eliminado porque está asignado a " + usersWithRole + " usuario(s).");
        }

        roleRepository.deleteById(id);
    }
}