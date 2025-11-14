package com.dog.service;

import com.dog.dto.request.Payment.PaymentRequest;
import com.dog.dto.response.PaymentResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentResponse makePayment(PaymentRequest dto, UserDetails currentUser);
    PaymentResponse confirmPayment(UUID paymentId, UserDetails currentUser);
    List<PaymentResponse> getPaymentsByStudent(UUID studentId);
    List<PaymentResponse> getPaymentsByPost(UUID postId);
    List<PaymentResponse> getAllPayments();

    List<PaymentResponse> getMyPayments(UserDetails currentUser);
    List<PaymentResponse> getPaymentsByOwner(UserDetails currentUser);
    PaymentResponse regeneratePayment(UUID previousPaymentId, UserDetails currentUser);
}
