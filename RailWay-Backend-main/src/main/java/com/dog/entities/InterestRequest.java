package com.dog.entities;

import com.dog.dto.request.Interest.InterestRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "interest_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InterestRequestStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // --- CAMPOS ANTIGUOS REUTILIZADOS ---

    /**
     * Almacena la ranura de tiempo EXACTA que el estudiante elige del calendario.
     * Será nulo hasta que el estudiante confirme.
     */
    @Column(name = "appointment_datetime")
    private LocalDateTime appointmentDateTime;

    /**
     * Mantiene el mensaje que el propietario envía junto con su propuesta de disponibilidad.
     */
    @Column(name = "appointment_message")
    private String appointmentMessage;

    // --- NUEVOS CAMPOS PARA EL CALENDARIO DE DISPONIBILIDAD ---

    /**
     * El primer día que el propietario está disponible (ej: Lunes).
     */
    @Column(name = "availability_start_date")
    private LocalDate availabilityStartDate;

    /**
     * El último día que el propietario está disponible (ej: Viernes).
     */
    @Column(name = "availability_end_date")
    private LocalDate availabilityEndDate;

    /**
     * La hora a la que empieza a estar disponible cada día (ej: 14:00).
     */
    @Column(name = "availability_start_time")
    private LocalTime availabilityStartTime;

    /**
     * La hora a la que deja de estar disponible cada día (ej: 17:00).
     */
    @Column(name = "availability_end_time")
    private LocalTime availabilityEndTime;

    /**
     * La duración de cada bloque de cita en minutos (ej: 30, 60).
     * Esto permitirá al frontend generar los "slots" disponibles.
     */
    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes;


    // --- CAMPOS QUE SE MANTIENEN IGUAL ---

    @Column(name = "appointment_confirmed_by_student")
    private boolean appointmentConfirmedByStudent = false;

    @Column(name = "last_updated_by")
    private String lastUpdatedBy;
}