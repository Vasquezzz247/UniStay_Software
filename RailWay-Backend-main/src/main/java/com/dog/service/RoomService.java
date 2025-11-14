package com.dog.service;

import com.dog.dto.request.Room.RoomRequest;
import com.dog.dto.request.Room.RoomUpdateRequest;
import com.dog.dto.response.RoomResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.userdetails.UserDetails;


public interface RoomService {
    List<RoomResponse> findAll();
    RoomResponse findById(UUID UUID);
    RoomResponse save(RoomRequest roomRequest, String ownerEmail);
    RoomResponse update(RoomUpdateRequest roomUpdateRequest, UserDetails currentUser);
    void delete(UUID UUID, UserDetails currentUser);
    List<RoomResponse> findRoomsByCurrentUser(String email);
}
