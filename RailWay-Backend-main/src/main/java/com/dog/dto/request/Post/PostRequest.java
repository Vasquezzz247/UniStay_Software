package com.dog.dto.request.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostRequest {

    @NotBlank(message = "Debes proveer un título")
    @Size(max = 255)
    private String title;

    @NotNull(message = "Debes proveer un precio")
    @PositiveOrZero(message = "El precio debe ser cero o positivo")
    private Double price;

    @NotBlank(message = "Debes proveer un estado")
    @Size(max = 50)
    private String status;

    @NotBlank(message = "Debes proveer el ID del propietario (owner UUID string)")
    private String owner;

    @NotBlank(message = "Debes proveer el ID de la habitación (room UUID string)")
    private String room;

    @Size(max = 100, message = "El plazo mínimo no debe exceder los 100 caracteres")
    private String minimumLeaseTerm;

    @Size(max = 100, message = "El plazo máximo no debe exceder los 100 caracteres")
    private String maximumLeaseTerm;

    @PositiveOrZero(message = "El depósito de seguridad debe ser cero o positivo")
    private Double securityDeposit;
}