package com.dog.service.impl;

import com.dog.dto.request.Payment.PaymentRequest;
import com.dog.dto.request.Payment.PaymentStatus;
import com.dog.dto.response.PaymentResponse;
import com.dog.entities.InterestRequest;
import com.dog.entities.Payment;
import com.dog.entities.Post;
import com.dog.entities.User;
import com.dog.exception.ResourceNotFoundException;
import com.dog.exception.UnauthorizedOperationException;
import com.dog.repository.InterestRequestRepository;
import com.dog.repository.PaymentRepository;
import com.dog.repository.PostRepository;
import com.dog.repository.UserRepository;
import com.dog.service.PaymentService;
import com.dog.utils.mappers.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InterestRequestRepository interestRequestRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments(UserDetails currentUser) {
        User student = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", currentUser.getUsername()));

        return paymentRepository.findByInterestRequest_Student_Id(student.getId())
                .stream()
                .map(paymentMapper::toResponse) // <-- Esta llamada usará el mapper corregido
                .collect(Collectors.toList());
    }

    // Aquí incluyo el resto de los métodos para que el archivo esté 100% completo.

    @Override
    @Transactional
    public PaymentResponse makePayment(PaymentRequest request, UserDetails currentUser) {
        InterestRequest interest = interestRequestRepository.findById(request.getInterestRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de interés", "id", request.getInterestRequestId()));

        if (!interest.getPost().getOwner().getEmail().equals(currentUser.getUsername())) {
            throw new UnauthorizedOperationException("No tienes permiso para solicitar un pago para esta publicación.");
        }

        Double price = interest.getPost().getPrice();
        Double deposit = interest.getPost().getSecurityDeposit();

        BigDecimal priceDecimal = (price != null) ? BigDecimal.valueOf(price) : BigDecimal.ZERO;
        BigDecimal depositDecimal = (deposit != null) ? BigDecimal.valueOf(deposit) : BigDecimal.ZERO;

        BigDecimal amount = priceDecimal.add(depositDecimal);

        Payment newPayment = Payment.builder()
                .interestRequest(interest)
                .amount(amount)
                .status(PaymentStatus.UNPAID)
                .build();

        Payment savedPayment = paymentRepository.save(newPayment);

        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(UUID paymentId, UserDetails currentUser) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", paymentId));

        if (!payment.getInterestRequest().getStudent().getEmail().equals(currentUser.getUsername())) {
            throw new UnauthorizedOperationException("No tienes permiso para confirmar este pago.");
        }

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Este pago ya ha sido confirmado.");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDateTime.now());

        Post post = payment.getInterestRequest().getPost();
        post.setStatus("ALQUILADO");
        postRepository.save(post);

        Payment confirmedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponse(confirmedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse regeneratePayment(UUID previousPaymentId, UserDetails currentUser) {
        // 1. Buscamos el pago anterior para usarlo como plantilla.
        Payment oldPayment = paymentRepository.findById(previousPaymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", previousPaymentId));

        // 2. Verificación de seguridad: solo el propietario del post puede regenerar el pago.
        String ownerEmail = oldPayment.getInterestRequest().getPost().getOwner().getEmail();
        if (!ownerEmail.equals(currentUser.getUsername())) {
            throw new UnauthorizedOperationException("No tienes permiso para regenerar este pago.");
        }

        // 3. Creamos una nueva entidad de Pago.
        Payment newPayment = new Payment();

        // 4. Copiamos los datos clave del pago antiguo.
        newPayment.setInterestRequest(oldPayment.getInterestRequest());
        newPayment.setAmount(oldPayment.getAmount());

        // 5. Establecemos los nuevos valores.
        newPayment.setStatus(PaymentStatus.UNPAID);
        // newPayment.setCreatedAt(LocalDateTime.now()); // <-- SE ELIMINA ESTA LÍNEA
        newPayment.setPaymentDate(null);

        // 6. Guardamos el nuevo pago en la base de datos.
        //    Al llamar a save(), JPA Auditing establecerá la fecha de creación automáticamente.
        Payment savedNewPayment = paymentRepository.save(newPayment);

        // 7. Lo convertimos a DTO y lo devolvemos.
        return paymentMapper.toResponse(savedNewPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByOwner(UserDetails currentUser) {
        String ownerEmail = currentUser.getUsername();
        return paymentRepository.findByInterestRequest_Post_Owner_Email(ownerEmail)
                .stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStudent(UUID studentId) {
        return paymentRepository.findByInterestRequest_Student_Id(studentId)
                .stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByPost(UUID postId) {
        return paymentRepository.findByInterestRequest_Post_Id(postId)
                .stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

}