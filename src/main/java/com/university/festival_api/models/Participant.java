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
    private String songTitle;
    private String performanceGenre;
    private Prize prize;
    private Venue venue;
    private List<Equipment> equipments=new ArrayList<>();
    private List<Prop> proplist=new ArrayList<>();
    private List<Criterion> criterion=new ArrayList<>();
    private Integer tour1Score=0;
    private Integer tour2Score=0;
    private Integer tour3Score=0;
    
    private Integer allocatedSemiFinal;
    private Integer publicVote=0;
    private Double finalScore;
    private String country;
    private String photoBase64;
    private Integer performanceOrder;
}
