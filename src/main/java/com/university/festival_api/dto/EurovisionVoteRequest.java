package com.university.festival_api.dto;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class EurovisionVoteRequest {
    private UUID juryId;
    private int tourNumber;
    private String judgeName; 
    private List<VoteEntry> votes; 
}
