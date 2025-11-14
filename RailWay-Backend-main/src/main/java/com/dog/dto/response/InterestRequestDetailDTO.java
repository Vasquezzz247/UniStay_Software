package com.dog.dto.response;

import com.dog.dto.request.Interest.InterestRequestStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class InterestRequestDetailDTO {

    private UUID id;
    private UUID postId;
    private String postTitle;
    private String studentName;
    private String studentEmail;
    private InterestRequestStatus status;
    private LocalDateTime createdAt;

    private LocalDateTime appointmentDateTime;
    private String appointmentMessage;
    private boolean appointmentConfirmedByStudent;

    // --- NUEVOS CAMPOS AÑADIDOS ---
    private LocalDate availabilityStartDate;
    private LocalDate availabilityEndDate;
    private LocalTime availabilityStartTime;
    private LocalTime availabilityEndTime;
    private Integer slotDurationMinutes;
}