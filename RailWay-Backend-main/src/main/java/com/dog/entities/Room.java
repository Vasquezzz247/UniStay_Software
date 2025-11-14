package com.dog.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Table(name = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "address")
    private String address;

    @Column(name = "available", columnDefinition = "boolean default true")
    private boolean available;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User owner;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lng")
    private Double lng;

    @Column(name = "square_footage")
    private Integer squareFootage;

    @Column(name = "bathroom_type")
    private String bathroomType;

    @Column(name = "kitchen_type")
    private String kitchenType;

    @Column(name = "is_furnished")
    private Boolean isFurnished;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id")) // Crea una tabla separada room_amenities
    @Column(name = "amenity")
    @Builder.Default // Si usas Lombok @Builder, para inicializar la lista
    private List<String> amenities = new ArrayList<>();
}