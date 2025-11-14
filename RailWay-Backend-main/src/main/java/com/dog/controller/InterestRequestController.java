package com.dog.controller;

import com.dog.dto.request.Interest.AppointmentConfirmationDTO;
import com.dog.dto.request.Interest.AvailabilityProposalDTO; // Importamos el nuevo DTO
import com.dog.dto.request.Interest.InterestRequestCreateDTO;
import com.dog.dto.request.Interest.InterestRequestStatus;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.InterestRequestDetailDTO;
import com.dog.dto.response.InterestRequestResponseDTO;
import com.dog.exception.UnauthorizedOperationException;
import com.dog.service.InterestRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
public class InterestRequestController {

    private final InterestRequestService interestService;

    // --- ENDPOINT MODIFICADO PARA PROPONER DISPONIBILIDAD ---
    // La ruta ahora es más específica y recibe el nuevo DTO.
    @PatchMapping("/{id}/availability")
    public ResponseEntity<GeneralResponse> proposeAvailability(
            @PathVariable UUID id,
            @Valid @RequestBody AvailabilityProposalDTO dto,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        try {
            InterestRequestResponseDTO updated = interestService.proposeAvailability(id, dto, currentUser);
            return buildResponse("Availability proposed successfully", HttpStatus.OK, updated);
        } catch (UnauthorizedOperationException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo proponer la disponibilidad: " + e.getMessage(), e);
        }
    }

    // --- ENDPOINT MODIFICADO PARA CONFIRMAR CITA ---
    // La lógica se mantiene, pero ahora devuelve GeneralResponse.
    @PatchMapping("/{id}/appointment/confirm")
    public ResponseEntity<GeneralResponse> confirmAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentConfirmationDTO dto,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        InterestRequestResponseDTO updated = interestService.confirmAppointment(id, dto, currentUser);
        return buildResponse("Appointment confirmation updated successfully", HttpStatus.OK, updated);
    }

    // --- RESTO DE ENDPOINTS ADAPTADOS ---

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GeneralResponse> getInterestById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        InterestRequestDetailDTO detailDTO = interestService.getInterestById(id, currentUser);
        return buildResponse("Interest request found successfully", HttpStatus.OK, detailDTO);
    }

    @PostMapping
    public ResponseEntity<GeneralResponse> create(
            @Valid @RequestBody InterestRequestCreateDTO dto,
            @AuthenticationPrincipal UserDetails student
    ) {
        InterestRequestResponseDTO created = interestService.createInterest(dto, student.getUsername());
        return buildResponse("Interest request created successfully", HttpStatus.CREATED, created);
    }

    @GetMapping("/mine")
    public ResponseEntity<GeneralResponse> getMyRequests(
            @AuthenticationPrincipal UserDetails student
    ) {
        List<InterestRequestResponseDTO> myRequests = interestService.getMyRequests(student.getUsername());
        return buildResponse("User's interest requests retrieved successfully", HttpStatus.OK, myRequests);
    }

    @GetMapping("/received")
    public ResponseEntity<GeneralResponse> getReceivedRequests(
            @AuthenticationPrincipal UserDetails owner
    ) {
        List<InterestRequestDetailDTO> received = interestService.getRequestsReceived(owner.getUsername());
        return buildResponse("Received interest requests retrieved successfully", HttpStatus.OK, received);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<GeneralResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam InterestRequestStatus status,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        InterestRequestResponseDTO updated = interestService.updateStatus(id, status, currentUser);
        return buildResponse("Interest request status updated successfully", HttpStatus.OK, updated);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<GeneralResponse> cancelInterestRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        InterestRequestResponseDTO updated = interestService.cancelInterestRequest(id, currentUser);
        return buildResponse("Interest request cancelled successfully", HttpStatus.OK, updated);
    }

    @GetMapping("/owner/accepted")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getAcceptedRequests(
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        List<InterestRequestDetailDTO> requests = interestService.getAcceptedRequestsForOwner(currentUser.getUsername());
        return buildResponse("Accepted requests ready for payment retrieved", HttpStatus.OK, requests);
    }

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