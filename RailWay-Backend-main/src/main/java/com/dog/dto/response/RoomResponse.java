package com.dog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private UUID roomId;
    private String description;
    private String address;
    private Double lat;
    private Double lng;
    private boolean available;
    private String ownerName;
    private Integer squareFootage;
    private String bathroomType;
    private String kitchenType;
    private Boolean isFurnished;
    private List<String> amenities;


    private boolean hasActivePost;
}