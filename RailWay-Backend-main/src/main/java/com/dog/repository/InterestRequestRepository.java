package com.dog.repository;

import com.dog.dto.request.Interest.InterestRequestStatus;
import com.dog.entities.InterestRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterestRequestRepository extends JpaRepository<InterestRequest, UUID> {

    List<InterestRequest> findByPost_Id(UUID postId);
    List<InterestRequest> findByStudent_Id(UUID studentId);
    Optional<InterestRequest> findByPost_IdAndStudent_Id(UUID postId, UUID studentId);
    List<InterestRequest> findByPost_Owner_Email(String email);
    List<InterestRequest> findByStatus(InterestRequestStatus status);

    List<InterestRequest> findByPost_Owner_EmailAndStatusAndAppointmentConfirmedByStudentIsTrue(String ownerEmail, InterestRequestStatus status);
}