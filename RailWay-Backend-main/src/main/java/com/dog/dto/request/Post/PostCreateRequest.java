package com.dog.dto.request.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PostCreateRequest {
    @NotBlank(message = "El título es obligatorio.")
    private String title;

    @NotNull(message = "El precio es obligatorio.")
    @Positive(message = "El precio debe ser un número positivo.")
    private BigDecimal price;

    @NotBlank(message = "El estado es obligatorio.")
    private String status;

    @NotNull(message = "Debes seleccionar una habitación.")
    private UUID roomId;

    @NotNull(message = "El precio es obligatorio.")
    private String minimumLeaseTerm;
    @NotNull(message = "El precio es obligatorio.")
    private String maximumLeaseTerm;
    @NotNull(message = "El precio es obligatorio.")
    private BigDecimal securityDeposit;
}
