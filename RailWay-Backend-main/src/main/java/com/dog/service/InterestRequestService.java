package com.dog.service;

import com.dog.dto.request.Interest.AppointmentConfirmationDTO;
import com.dog.dto.request.Interest.AvailabilityProposalDTO;
import com.dog.dto.request.Interest.InterestRequestCreateDTO;
import com.dog.dto.request.Interest.InterestRequestStatus;
import com.dog.dto.response.InterestRequestDetailDTO;
import com.dog.dto.response.InterestRequestResponseDTO;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.UUID;

public interface InterestRequestService {

    InterestRequestResponseDTO proposeAvailability(UUID interestId, AvailabilityProposalDTO dto, UserDetails currentUser);
    InterestRequestResponseDTO confirmAppointment(UUID interestId, AppointmentConfirmationDTO dto, UserDetails currentUser);
    InterestRequestDetailDTO getInterestById(UUID id, UserDetails currentUser);
    InterestRequestResponseDTO createInterest(InterestRequestCreateDTO dto, String studentEmail);
    List<InterestRequestResponseDTO> getMyRequests(String studentEmail);
    List<InterestRequestDetailDTO> getRequestsReceived(String ownerEmail);
    InterestRequestResponseDTO updateStatus(UUID interestId, InterestRequestStatus newStatus, UserDetails currentUser);
    InterestRequestResponseDTO cancelInterestRequest(UUID interestId, UserDetails currentUser);

    List<InterestRequestDetailDTO> getAcceptedRequestsForOwner(String ownerEmail);
}