package com.dog.utils.mappers;

import com.dog.dto.response.PaymentResponse;
import com.dog.entities.Payment;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        if (payment == null) return null;

        return PaymentResponse.builder()
                .id(payment.getId())
                .postId(payment.getInterestRequest().getPost().getId())
                .postTitle(payment.getInterestRequest().getPost().getTitle()) // <-- AÑADE ESTA LÍNEA
                .studentId(payment.getInterestRequest().getStudent().getId())
                .studentName(payment.getInterestRequest().getStudent().getName()) // <-- AÑADE ESTA LÍNEA
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .build();
    }

    public List<PaymentResponse> toResponseList(List<Payment> payments) {
        if (payments == null || payments.isEmpty()) return Collections.emptyList();
        return payments.stream().map(this::toResponse).collect(Collectors.toList());
    }
}