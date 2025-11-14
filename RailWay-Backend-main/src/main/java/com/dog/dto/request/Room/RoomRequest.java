package com.dog.dto.request.Room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {

    @NotBlank(message = "La descripción no puede estar vacía.")
    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres.")
    private String description;

    @NotBlank(message = "La dirección no puede estar vacía.")
    private String address;

    @NotNull(message = "Debe especificar si la habitación está disponible.") // Nueva validación
    private Boolean available;

    @NotNull(message = "Los metros cuadrados son requeridos.")
    @Positive(message = "Los metros cuadrados deben ser un número positivo.")
    private Integer squareFootage;

    @NotBlank(message = "El tipo de baño es requerido.")
    private String bathroomType;

    @NotBlank(message = "El tipo de cocina es requerida.")
    private String kitchenType;

    @NotNull(message = "Debe especificar si está amoblado.")
    private Boolean isFurnished;

    @Size(max = 20, message = "No puedes añadir más de 20 amenidades.")
    private List<String> amenities;

    @NotNull(message = "La latitud es requerida.")
    private Double lat;

    @NotNull(message = "La longitud es requerida.")
    private Double lng;

}