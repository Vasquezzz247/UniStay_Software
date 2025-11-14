// src/main/java/com/dog/controller/PaymentController.java

package com.dog.controller;

import com.dog.dto.request.Payment.PaymentRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.PaymentResponse;
import com.dog.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // --- ENDPOINT AÑADIDO PARA REGENERAR PAGOS ---
    @PostMapping("/{previousPaymentId}/regenerate")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> regeneratePayment(
            @PathVariable UUID previousPaymentId,
            @AuthenticationPrincipal UserDetails currentUser) {

        PaymentResponse newPaymentDto = paymentService.regeneratePayment(previousPaymentId, currentUser);
        // Usamos tu método buildResponse para una respuesta consistente
        return buildResponse("Nueva solicitud de pago generada exitosamente", HttpStatus.CREATED, newPaymentDto);
    }
    // ---------------------------------------------


    @GetMapping("/mine")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<GeneralResponse> getMyPayments(
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        List<PaymentResponse> payments = paymentService.getMyPayments(currentUser);
        return buildResponse("Student's payments retrieved successfully", HttpStatus.OK, payments);
    }

    @PostMapping
    public ResponseEntity<GeneralResponse> makePayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        PaymentResponse payment = paymentService.makePayment(request, currentUser);
        return buildResponse("Payment request created successfully", HttpStatus.CREATED, payment);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<GeneralResponse> confirmPayment(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        PaymentResponse payment = paymentService.confirmPayment(id, currentUser);
        return buildResponse("Payment confirmed successfully", HttpStatus.OK, payment);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<GeneralResponse> getPaymentsByStudent(@PathVariable UUID id) {
        List<PaymentResponse> payments = paymentService.getPaymentsByStudent(id);
        return buildResponse("Payments for student found", HttpStatus.OK, payments);
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<GeneralResponse> getPaymentsByPost(@PathVariable UUID id) {
        List<PaymentResponse> payments = paymentService.getPaymentsByPost(id);
        return buildResponse("Payments for post found", HttpStatus.OK, payments);
    }

    @GetMapping
    public ResponseEntity<GeneralResponse> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return buildResponse("All payments retrieved successfully", HttpStatus.OK, payments);
    }

    @GetMapping("/owner/mine")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getOwnerPayments(
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        List<PaymentResponse> payments = paymentService.getPaymentsByOwner(currentUser);
        return buildResponse("Owner's payments retrieved successfully", HttpStatus.OK, payments);
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