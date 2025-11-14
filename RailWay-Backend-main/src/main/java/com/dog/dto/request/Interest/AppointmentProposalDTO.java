package com.dog.dto.request.Interest;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentProposalDTO {
    private LocalDateTime appointmentDateTime;
    private String appointmentMessage;
}