package com.dog.entities;

import com.dog.dto.request.Payment.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue
    private UUID id;

    private BigDecimal amount;
    private LocalDateTime paymentDate;
    //private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interest_request_id", nullable = false)
    private InterestRequest interestRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

}

