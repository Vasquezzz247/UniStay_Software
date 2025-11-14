package com.dog.service.impl;

import com.dog.dto.request.Interest.AppointmentConfirmationDTO;
import com.dog.dto.request.Interest.AvailabilityProposalDTO;
import com.dog.dto.request.Interest.InterestRequestCreateDTO;
import com.dog.dto.request.Interest.InterestRequestStatus;
import com.dog.dto.response.InterestRequestDetailDTO;
import com.dog.dto.response.InterestRequestResponseDTO;
import com.dog.entities.InterestRequest;
import com.dog.entities.Post;
import com.dog.entities.User;
import com.dog.exception.ResourceNotFoundException;
import com.dog.exception.UnauthorizedOperationException;
import com.dog.repository.InterestRequestRepository;
import com.dog.repository.PaymentRepository;
import com.dog.repository.PostRepository;
import com.dog.repository.UserRepository;
import com.dog.service.InterestRequestService;
import com.dog.utils.mappers.InterestRequestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestRequestServiceImpl implements InterestRequestService {

    private final InterestRequestRepository interestRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PaymentRepository paymentRepository;

    @Value("${spring.mail.username:no-reply@unistay.com}")
    private String senderEmail;

    @Override
    @Transactional
    public InterestRequestResponseDTO proposeAvailability(UUID interestId, AvailabilityProposalDTO dto, UserDetails currentUser) {

        InterestRequest request = interestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", interestId));

        if (!request.getPost().getOwner().getEmail().equals(currentUser.getUsername())) {
            throw new UnauthorizedOperationException("No tienes permiso para proponer una disponibilidad para esta solicitud.");
        }

        System.out.println("[PASO 2] Asignando valores a la entidad de la base de datos...");
        request.setAvailabilityStartDate(dto.getAvailabilityStartDate());
        request.setAvailabilityEndDate(dto.getAvailabilityEndDate());
        request.setAvailabilityStartTime(dto.getAvailabilityStartTime());
        request.setAvailabilityEndTime(dto.getAvailabilityEndTime());
        request.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        request.setAppointmentMessage(dto.getMessage());
        request.setLastUpdatedBy(currentUser.getUsername());
        request.setStatus(InterestRequestStatus.IN_CONTACT);
        request.setAppointmentDateTime(null);
        request.setAppointmentConfirmedByStudent(false);

        System.out.println("[PASO 3] Entidad modificada. Valor de 'availabilityStartDate' ahora es: " + request.getAvailabilityStartDate());

        InterestRequest updated = interestRepository.saveAndFlush(request);

        System.out.println("[PASO 4] Después de saveAndFlush. Valor en la entidad devuelta: " + updated.getAvailabilityStartDate());

        InterestRequestResponseDTO responseDto = InterestRequestMapper.toResponseDTO(updated);

        System.out.println("[PASO 5] Después de mapear, el DTO que se va a retornar es: " + responseDto.toString());
        System.out.println("================================================\n\n");

        sendAppointmentNotificationEmail(request.getStudent().getEmail());

        return responseDto;
    }


    @Override
    @Transactional
    public InterestRequestResponseDTO confirmAppointment(UUID interestId, AppointmentConfirmationDTO dto, UserDetails currentUser) {
        InterestRequest request = interestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", interestId));

        if (!request.getStudent().getEmail().equals(currentUser.getUsername())) {
            throw new UnauthorizedOperationException("Solo el estudiante puede confirmar la cita.");
        }

        // --- INICIO DE LA CORRECCIÓN ---
        // La acción de confirmar ahora se basa en la existencia de un 'chosenSlot' en el DTO.
        // La lógica de aceptar/rechazar fue movida al frontend. Aquí siempre se acepta.
        request.setAppointmentDateTime(dto.getChosenSlot());
        request.setAppointmentConfirmedByStudent(true);
        request.setStatus(InterestRequestStatus.ACCEPTED);

        InterestRequest updated = interestRepository.saveAndFlush(request);

        // Notificamos al propietario que la cita fue aceptada.
        sendConfirmationResultEmail(request.getPost().getOwner().getEmail(), true);

        return InterestRequestMapper.toResponseDTO(updated);
        // --- FIN DE LA CORRECCIÓN ---
    }

    // --- El resto de tus métodos ---

    @Override
    @Transactional(readOnly = true)
    public InterestRequestDetailDTO getInterestById(UUID id, UserDetails currentUser) {
        InterestRequest request = interestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", id));
        boolean isOwner = request.getPost().getOwner().getEmail().equals(currentUser.getUsername());
        boolean isStudent = request.getStudent().getEmail().equals(currentUser.getUsername());
        if (!isOwner && !isStudent) {
            throw new UnauthorizedOperationException("No tienes permiso para ver los detalles de esta solicitud.");
        }
        return InterestRequestMapper.toDetailDTO(request);
    }

    @Override
    @Transactional
    public InterestRequestResponseDTO createInterest(InterestRequestCreateDTO dto, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", studentEmail));
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Publicación", "id", dto.getPostId()));
        boolean alreadyExists = interestRepository
                .findByPost_IdAndStudent_Id(post.getId(), student.getId()).isPresent();
        if (alreadyExists) {
            throw new IllegalStateException("Ya enviaste una solicitud para esta publicación.");
        }
        InterestRequest entity = InterestRequestMapper.toEntity(dto, student, post);
        InterestRequest saved = interestRepository.save(entity);
        sendNotificationEmail(post.getOwner().getEmail());
        return InterestRequestMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterestRequestResponseDTO> getMyRequests(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", studentEmail));
        return interestRepository.findByStudent_Id(student.getId())
                .stream()
                .map(InterestRequestMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterestRequestDetailDTO> getRequestsReceived(String ownerEmail) {
        return interestRepository.findByPost_Owner_Email(ownerEmail)
                .stream()
                .map(InterestRequestMapper::toDetailDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InterestRequestResponseDTO updateStatus(UUID interestId, InterestRequestStatus newStatus, UserDetails currentUser) {
        InterestRequest request = interestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", interestId));
        if (newStatus == InterestRequestStatus.IN_CONTACT) {
            throw new IllegalStateException("El estado IN_CONTACT solo se puede establecer al proponer una cita.");
        }
        request.setStatus(newStatus);
        return InterestRequestMapper.toResponseDTO(interestRepository.save(request));
    }

    @Override
    @Transactional
    public InterestRequestResponseDTO cancelInterestRequest(UUID interestId, UserDetails currentUser) {
        InterestRequest request = interestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", interestId));
        String requesterEmail = currentUser.getUsername();
        boolean isStudent = request.getStudent().getEmail().equals(requesterEmail);
        if (!isStudent) {
            throw new UnauthorizedOperationException("Solo el estudiante puede cancelar esta solicitud.");
        }
        request.setStatus(InterestRequestStatus.CLOSED);
        InterestRequest updated = interestRepository.save(request);
        return InterestRequestMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterestRequestDetailDTO> getAcceptedRequestsForOwner(String ownerEmail) {
        // 1. Busca todas las solicitudes aceptadas
        List<InterestRequest> acceptedRequests = interestRepository
                .findByPost_Owner_EmailAndStatusAndAppointmentConfirmedByStudentIsTrue(ownerEmail, InterestRequestStatus.ACCEPTED);

        // 2. Filtra para excluir aquellas que ya tienen un pago generado
        return acceptedRequests.stream()
                .filter(request -> !paymentRepository.existsByInterestRequest_Id(request.getId()))
                .map(InterestRequestMapper::toDetailDTO)
                .collect(Collectors.toList());
    }

    private void sendNotificationEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Nueva solicitud de interés en una de tus publicaciones");
        message.setText("¡Hola! Has recibido una nueva solicitud en una de tus habitaciones.\n\n" +
                "Por favor inicia sesión en UniStay para ver los detalles completos.\n\n" +
                "Este mensaje es automático. No respondas a este correo.");

        mailSender.send(message);

    }

    private void sendAppointmentNotificationEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Nueva propuesta de cita en UniStay");
        message.setText("Se ha propuesto una nueva fecha para reunirse en relación a una solicitud de interés.\n\n" +
                "Por favor, inicia sesión en UniStay para revisar la propuesta.\n\n" +
                "Este mensaje es automático. No respondas a este correo.");
        mailSender.send(message);

    }

    private void sendConfirmationResultEmail(String toEmail, boolean accepted) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Respuesta a la cita en UniStay");

        if (accepted) {
            message.setText("El estudiante ha aceptado la propuesta de cita.\n\n" +
                    "Inicia sesión en UniStay para ver los detalles y prepararte para la reunión.");
        } else {
            message.setText("El estudiante ha rechazado la propuesta de cita.\n\n" +
                    "Puedes proponer una nueva fecha si aún estás interesado.");
        }

        mailSender.send(message);

    }
}