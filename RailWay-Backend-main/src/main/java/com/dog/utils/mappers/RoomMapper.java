package com.dog.utils.mappers; // O tu paquete de mappers

import com.dog.dto.request.Room.RoomRequest;
import com.dog.dto.request.Room.RoomUpdateRequest; // Asume que este DTO también podría tener 'available'
import com.dog.dto.response.RoomResponse;         // Asume que este DTO tiene 'available'
import com.dog.entities.Room;
import com.dog.entities.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class RoomMapper {

    public static Room toEntity(RoomResponse roomResponse, User owner) {
        if (roomResponse == null) return null;
        return Room.builder()
                .id(roomResponse.getRoomId())
                .description(roomResponse.getDescription())
                .address(roomResponse.getAddress())
                .available(roomResponse.isAvailable())
                .owner(owner)
                .squareFootage(roomResponse.getSquareFootage())
                .bathroomType(roomResponse.getBathroomType())
                .kitchenType(roomResponse.getKitchenType())
                .isFurnished(roomResponse.getIsFurnished())
                .amenities(roomResponse.getAmenities() != null ? new ArrayList<>(roomResponse.getAmenities()) : new ArrayList<>())
                .build();
    }

    public static Room toEntityCreate(RoomRequest roomDTO, User owner) {
        if (roomDTO == null) return null;
        return Room.builder()
                .description(roomDTO.getDescription())
                .address(roomDTO.getAddress())
                .available(roomDTO.getAvailable())
                .owner(owner)
                .squareFootage(roomDTO.getSquareFootage())
                .bathroomType(roomDTO.getBathroomType())
                .kitchenType(roomDTO.getKitchenType())
                .isFurnished(roomDTO.getIsFurnished())
                .lat(roomDTO.getLat())
                .lng(roomDTO.getLng())
                .amenities(roomDTO.getAmenities() != null ? new ArrayList<>(roomDTO.getAmenities()) : new ArrayList<>())
                .build();
    }

    public static Room toEntityUpdate(RoomUpdateRequest roomDTO, User owner) {
        if (roomDTO == null) {
            throw new IllegalArgumentException("RoomUpdateRequest DTO no puede ser nulo para la actualización.");
        }
        if (roomDTO.getRoomId() == null) {
            throw new IllegalArgumentException("RoomId es requerido en RoomUpdateRequest para la actualización.");
        }

        return Room.builder()
                .id(roomDTO.getRoomId())
                .description(roomDTO.getDescription())
                .address(roomDTO.getAddress())
                .available(roomDTO.getAvailable())
                .squareFootage(roomDTO.getSquareFootage())
                .bathroomType(roomDTO.getBathroomType())
                .kitchenType(roomDTO.getKitchenType())
                .isFurnished(roomDTO.getIsFurnished())
                .lat(roomDTO.getLat())
                .lng(roomDTO.getLng())
                .amenities(roomDTO.getAmenities() != null ? new ArrayList<>(roomDTO.getAmenities()) : new ArrayList<>())
                .owner(owner)
                .build();
    }

    public static RoomResponse toDTO(Room room) {
        if (room == null) return null;
        return RoomResponse.builder()
                .roomId(room.getId())
                .description(room.getDescription())
                .address(room.getAddress())
                .available(room.isAvailable())
                .ownerName(room.getOwner() != null ? room.getOwner().getName() : null)
                .squareFootage(room.getSquareFootage())
                .bathroomType(room.getBathroomType())
                .kitchenType(room.getKitchenType())
                .isFurnished(room.getIsFurnished())
                .lat(room.getLat())
                .lng(room.getLng())
                .amenities(room.getAmenities() != null ? new ArrayList<>(room.getAmenities()) : Collections.emptyList())
                .build();
    }

    public static List<RoomResponse> toDTOList(List<Room> rooms) {
        if (rooms == null) return Collections.emptyList();
        return rooms.stream()
                .map(RoomMapper::toDTO)
                .collect(Collectors.toList());
    }
}