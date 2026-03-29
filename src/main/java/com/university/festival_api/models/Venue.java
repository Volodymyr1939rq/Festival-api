package com.university.festival_api.models;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venue {
    private UUID id=UUID.randomUUID();
    private String name;
    private int capacity;
}
