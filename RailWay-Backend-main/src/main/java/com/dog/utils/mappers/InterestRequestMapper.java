package com.dog.utils.mappers;

import com.dog.dto.request.Interest.InterestRequestCreateDTO;
import com.dog.dto.response.InterestRequestDetailDTO;
import com.dog.dto.response.InterestRequestResponseDTO;
import com.dog.entities.InterestRequest;
import com.dog.entities.Post;
import com.dog.entities.User;
import com.dog.dto.request.Interest.InterestRequestStatus;

import java.time.LocalDateTime;

public class InterestRequestMapper {

    public static InterestRequest toEntity(InterestRequestCreateDTO dto, User student, Post post) {
        // ... (Este método no necesita cambios)
        return InterestRequest.builder()
                .post(post)
                .student(student)
                .status(InterestRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static InterestRequestResponseDTO toResponseDTO(InterestRequest entity) {
        InterestRequestResponseDTO dto = new InterestRequestResponseDTO();
        dto.setId(entity.getId());
        dto.setPostId(entity.getPost().getId());
        dto.setPostTitle(entity.getPost().getTitle());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setAppointmentDateTime(entity.getAppointmentDateTime());
        dto.setAppointmentMessage(entity.getAppointmentMessage());
        dto.setAppointmentConfirmedByStudent(entity.isAppointmentConfirmedByStudent());

        // --- LÍNEAS DE MAPEO AÑADIDAS ---
        dto.setAvailabilityStartDate(entity.getAvailabilityStartDate());
        dto.setAvailabilityEndDate(entity.getAvailabilityEndDate());
        dto.setAvailabilityStartTime(entity.getAvailabilityStartTime());
        dto.setAvailabilityEndTime(entity.getAvailabilityEndTime());
        dto.setSlotDurationMinutes(entity.getSlotDurationMinutes());

        return dto;
    }

    public static InterestRequestDetailDTO toDetailDTO(InterestRequest entity) {
        InterestRequestDetailDTO dto = new InterestRequestDetailDTO();
        dto.setId(entity.getId());
        dto.setPostId(entity.getPost().getId());
        dto.setPostTitle(entity.getPost().getTitle());
        dto.setStudentName(entity.getStudent().getName());
        dto.setStudentEmail(entity.getStudent().getEmail());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setAppointmentDateTime(entity.getAppointmentDateTime());
        dto.setAppointmentMessage(entity.getAppointmentMessage());
        dto.setAppointmentConfirmedByStudent(entity.isAppointmentConfirmedByStudent());

        // --- LÍNEAS DE MAPEO AÑADIDAS ---
        dto.setAvailabilityStartDate(entity.getAvailabilityStartDate());
        dto.setAvailabilityEndDate(entity.getAvailabilityEndDate());
        dto.setAvailabilityStartTime(entity.getAvailabilityStartTime());
        dto.setAvailabilityEndTime(entity.getAvailabilityEndTime());
        dto.setSlotDurationMinutes(entity.getSlotDurationMinutes());

        return dto;
    }
}