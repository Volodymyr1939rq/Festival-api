package com.university.festival_api.models;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participant {
    private UUID id=UUID.randomUUID();
    private String firstName;
    private String lastName;
    private String groupName;
    private String performanceGenre;
    private Prize prize;
    private Venue venue;
    private List<Equipment> equipments=new ArrayList<>();
    private List<Prop> proplist=new ArrayList<>();
    private List<Criterion> criterion=new ArrayList<>();
    private int tour1Score=0;
    private int tour2Score=0;
    private int tour3Score=0;
}
