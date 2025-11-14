package com.dog.dto.request.Interest;

import jakarta.validation.constraints.Future;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
public class AppointmentConfirmationDTO {

    @NotNull(message = "Debe seleccionar una fecha y hora para la cita.")
    @Future(message = "La cita debe ser en el futuro.")
    private LocalDateTime chosenSlot;
}

