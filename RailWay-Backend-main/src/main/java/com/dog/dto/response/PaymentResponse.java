package com.dog.dto.response;

import com.dog.dto.request.Payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PaymentResponse {
    private UUID id;
    private UUID postId;
    private String postTitle;
    private UUID studentId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentStatus status;
    private String studentName;
}
