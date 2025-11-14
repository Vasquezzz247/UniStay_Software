package com.dog.dto.request.Interest;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestRequestCreateDTO {
    @NotNull(message = "El ID del post es obligatorio.")
    private UUID postId;
    private LocalDateTime appointmentDateTime;
    private String appointmentMessage;
}
