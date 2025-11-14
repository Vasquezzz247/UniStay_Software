package com.dog.dto.request.Interest;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilityProposalDTO {

    @NotNull(message = "La fecha de inicio de disponibilidad es obligatoria.")
    @FutureOrPresent(message = "La fecha de inicio no puede ser en el pasado.")
    private LocalDate availabilityStartDate;

    @NotNull(message = "La fecha de fin de disponibilidad es obligatoria.")
    private LocalDate availabilityEndDate;

    @NotNull(message = "La hora de inicio es obligatoria.")
    private LocalTime availabilityStartTime;

    @NotNull(message = "La hora de fin es obligatoria.")
    private LocalTime availabilityEndTime;

    @NotNull(message = "La duración de la cita es obligatoria.")
    private Integer slotDurationMinutes;

    private String message;
}
