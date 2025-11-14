// src/main/java/com/dog/controller/RoomController.java

package com.dog.controller;

import com.dog.dto.request.Room.RoomRequest;
import com.dog.dto.request.Room.RoomUpdateRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.RoomResponse;
import com.dog.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/room")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // --- ENDPOINT DE DIAGNÓSTICO ---
    // Úsalo para ver qué roles tiene tu token en tiempo real
    @GetMapping("/my-rooms/debug")
    public ResponseEntity<String> getMyRoomsDebug(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("DEBUG: /my-rooms/debug - No hay usuario autenticado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado.");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        System.out.println("--- INICIO DEBUG DE ROLES ---");
        System.out.println("Usuario: " + userDetails.getUsername());
        if (authorities == null || authorities.isEmpty()) {
            System.out.println("Roles/Authorities: NINGUNO");
        } else {
            System.out.println("Roles/Authorities: " + authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        }
        System.out.println("--- FIN DEBUG DE ROLES ---");

        boolean hasRole = authorities.stream()
                .anyMatch(ga -> ga.getAuthority().equals("ROLE_ADMIN") || ga.getAuthority().equals("ROLE_PROPIETARIO"));

        if (hasRole) {
            return ResponseEntity.ok("Acceso concedido. Roles encontrados: " + authorities);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado. Roles encontrados: " + authorities);
        }
    }

    // --- Endpoint para crear una habitación ---
    @PostMapping
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> createRoom(@Valid @RequestBody RoomRequest roomRequest, Authentication authentication) {
        String ownerEmail = authentication.getName();
        RoomResponse createdRoom = roomService.save(roomRequest, ownerEmail);
        return buildResponse("Room created successfully", HttpStatus.CREATED, createdRoom);
    }

    // --- Endpoint para obtener las habitaciones del usuario logueado ---
    @GetMapping("/my-rooms")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getMyRooms(Authentication authentication) {
        String ownerEmail = authentication.getName();
        List<RoomResponse> rooms = roomService.findRoomsByCurrentUser(ownerEmail);
        return buildResponse("User's rooms retrieved successfully", HttpStatus.OK, rooms);
    }

    // --- Endpoint público para obtener todas las habitaciones ---
    @GetMapping
    public ResponseEntity<GeneralResponse> getAllRooms() {
        List<RoomResponse> rooms = roomService.findAll();
        return buildResponse("All rooms retrieved successfully", HttpStatus.OK, rooms);
    }

    // --- Endpoint público para obtener una habitación por ID ---
    @GetMapping("/{roomId}")
    public ResponseEntity<GeneralResponse> getRoomById(@PathVariable UUID roomId) {
        RoomResponse room = roomService.findById(roomId);
        return buildResponse("Room found", HttpStatus.OK, room);
    }

    // --- Endpoint para actualizar una habitación ---
    @PutMapping("/{roomId}")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> updateRoom(@PathVariable UUID roomId, @Valid @RequestBody RoomUpdateRequest roomUpdateRequest, Authentication authentication) {
        roomUpdateRequest.setRoomId(roomId);
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        RoomResponse updatedRoom = roomService.update(roomUpdateRequest, currentUser);
        return buildResponse("Room updated successfully", HttpStatus.OK, updatedRoom);
    }

    // --- Endpoint para eliminar una habitación ---
    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> deleteRoom(@PathVariable UUID roomId, Authentication authentication) {
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        roomService.delete(roomId, currentUser);
        return buildResponse("Room deleted successfully", HttpStatus.OK, null);
    }

    // --- Método Helper para construir respuestas ---
    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .build());
    }
}
