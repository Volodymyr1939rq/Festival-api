package com.university.festival_api.models;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalTask {
    private UUID id=UUID.randomUUID();
    private String title;
    private String description;
    private int tourNumber;

    private taskStatus status=taskStatus.TODO;
    private UUID assignedHostId;
}
