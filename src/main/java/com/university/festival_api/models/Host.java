package com.university.festival_api.models;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Host {
    private UUID id=UUID.randomUUID();
    private String fullName;
    private String phone;
    private String role;
}
