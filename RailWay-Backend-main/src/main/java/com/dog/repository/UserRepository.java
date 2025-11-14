// src/main/java/com/dog/repository/UserRepository.java
package com.dog.repository;

import com.dog.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    long countByRoles_Id(UUID roleId);
}
