package com.university.festival_api.dto;
import lombok.Data;

@Data
public class VoteEntry {
    private String participantId;
    private int score; 
}
