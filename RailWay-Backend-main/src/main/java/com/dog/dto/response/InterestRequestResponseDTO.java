package com.dog.dto.response;

import com.dog.dto.request.Interest.InterestRequestStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class InterestRequestResponseDTO {

    private UUID id;
    private UUID postId;
    private String postTitle;
    private InterestRequestStatus status;
    private LocalDateTime createdAt;

    // Campo que guarda la cita final elegida por el estudiante
    private LocalDateTime appointmentDateTime;
    private String appointmentMessage;
    private boolean appointmentConfirmedByStudent;

    // Nuevos campos para la disponibilidad
    private LocalDate availabilityStartDate;
    private LocalDate availabilityEndDate;
    private LocalTime availabilityStartTime;
    private LocalTime availabilityEndTime;
    private Integer slotDurationMinutes;
}