package com.university.festival_api.models;


import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Criterion {
    private UUID id=UUID.randomUUID();
    private String name;
    private int maxScore=12;
    private UUID juryId;
    private int receivedScore;
    private int tourNumber;

    private static final List<Integer> EUROVISION_SCORES=Arrays.asList(1,2,3,4,5,6,7,8,10,12);
     
    @JsonIgnore
    public boolean isValidEuroVisionScore(){
        return EUROVISION_SCORES.contains(this.receivedScore);
    }
}
