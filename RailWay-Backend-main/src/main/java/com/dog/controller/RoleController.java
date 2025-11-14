package com.dog.controller;

import com.dog.dto.request.Role.RoleRequest;
import com.dog.dto.request.Role.RoleUpdateRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.RoleResponse;
import com.dog.exception.RoleNotFoundException;
import com.dog.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/role")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<GeneralResponse> getAllRoles() {
        List<RoleResponse> roles = roleService.findAll();

        if (roles.isEmpty()) {
            throw new RoleNotFoundException("roles were not found");
        }
        return buildResponse("Roles found", HttpStatus.OK, roles);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('PROPIETARIO')")
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getRoleById(@PathVariable UUID id) {
        RoleResponse role = roleService.findById(id);
        return buildResponse("Role found", HttpStatus.OK, role);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<GeneralResponse> saveRole(@Valid @RequestBody RoleRequest role) {
        return buildResponse("Role created", HttpStatus.CREATED, roleService.save(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<GeneralResponse> updateRole(@RequestBody @Valid RoleUpdateRequest role) {
        roleService.findById(role.getRoleId());
        return buildResponse("Role updated", HttpStatus.OK, roleService.update(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<GeneralResponse> deleteRole(@PathVariable UUID id) {
        roleService.delete(id);
        return buildResponse("Role deleted", HttpStatus.OK, null);
    }

    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .build());
    }

}
