package com.dog.service.impl;

import com.dog.dto.request.Room.RoomRequest;
import com.dog.dto.request.Room.RoomUpdateRequest;
import com.dog.dto.response.RoomResponse;
import com.dog.entities.Room;
import com.dog.entities.User;
import com.dog.exception.*;
import com.dog.repository.PostRepository;
import com.dog.repository.RoomRepository;
import com.dog.repository.UserRepository;
import com.dog.service.RoomService;
import com.dog.utils.mappers.RoomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Value("${google.api.key}")
    private String googleApiKey;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, UserRepository userRepository, PostRepository postRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findAll() {
        return RoomMapper.toDTOList(roomRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse findById(UUID roomId) {
        return roomRepository.findById(roomId)
                .map(RoomMapper::toDTO)
                .orElseThrow(() -> new RoomNotFoundException("Habitación no encontrada con ID: " + roomId));
    }

    @Override
    @Transactional
    public RoomResponse save(RoomRequest roomRequest, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario (Propietario)", "email", ownerEmail));

        // Validar coordenadas si están dentro de San Salvador
        if (!isCoordinatesInSanSalvador(roomRequest.getLat(), roomRequest.getLng())) {
            throw new InvalidRoomLocationException("La dirección debe estar dentro del área de San Salvador.");
        }

        Room newRoom = RoomMapper.toEntityCreate(roomRequest, owner);
        return RoomMapper.toDTO(roomRepository.save(newRoom));
    }

    @Override
    @Transactional
    public RoomResponse update(RoomUpdateRequest roomUpdateRequest, UserDetails currentUser) {
        Room existingRoom = roomRepository.findById(roomUpdateRequest.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Habitación no encontrada para actualizar con ID: " + roomUpdateRequest.getRoomId()));

        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!existingRoom.getOwner().getEmail().equals(currentUser.getUsername()) && !isAdmin) {
            throw new UnauthorizedOperationException("No tienes permiso para editar esta habitación.");
        }

        // Validar coordenadas si cambiaron
        if (!isCoordinatesInSanSalvador(roomUpdateRequest.getLat(), roomUpdateRequest.getLng())) {
            throw new InvalidRoomLocationException("La dirección debe estar dentro del área de San Salvador.");
        }

        Room roomWithUpdates = RoomMapper.toEntityUpdate(roomUpdateRequest, existingRoom.getOwner());
        return RoomMapper.toDTO(roomRepository.save(roomWithUpdates));
    }

    @Override
    @Transactional
    public void delete(UUID roomId, UserDetails currentUser) {
        Room roomToDelete = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Habitación no encontrada para eliminar con ID: " + roomId));

        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!roomToDelete.getOwner().getEmail().equals(currentUser.getUsername()) && !isAdmin) {
            throw new UnauthorizedOperationException("No tienes permiso para eliminar esta habitación.");
        }

        long postCount = postRepository.countByRoomId(roomId);
        if (postCount > 0) {
            throw new RoomInUseException("La habitación no puede ser eliminada porque está asociada a " + postCount + " publicación(es).");
        }

        roomRepository.deleteById(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findRoomsByCurrentUser(String email) {
        List<Room> allUserRooms = roomRepository.findByOwner_Email(email);

        return allUserRooms.stream()
                .map(room -> {
                    RoomResponse dto = RoomMapper.toDTO(room);
                    boolean isInUse = postRepository.countByRoomId(room.getId()) > 0;
                    dto.setHasActivePost(isInUse);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private boolean isCoordinatesInSanSalvador(double lat, double lng) {
        double minLat = 13.64;
        double maxLat = 13.73;
        double minLng = -89.31;
        double maxLng = -89.18;

        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    }
}