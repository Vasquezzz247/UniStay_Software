package com.dog.repository;

import com.dog.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByInterestRequest_Student_Id(UUID studentId);
    List<Payment> findByInterestRequest_Post_Id(UUID postId);
    List<Payment> findByInterestRequest_Id(UUID interestRequestId);
    List<Payment> findByInterestRequest_Post_Owner_Email(String ownerEmail);
    boolean existsByInterestRequest_Id(UUID interestRequestId);
}
