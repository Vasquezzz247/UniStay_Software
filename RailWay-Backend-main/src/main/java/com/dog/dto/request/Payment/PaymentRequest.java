package com.dog.dto.request.Payment;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class PaymentRequest {
    private UUID interestRequestId;

    /*@NotNull(message = "Amount is required")
    private BigDecimal amount;*/
}