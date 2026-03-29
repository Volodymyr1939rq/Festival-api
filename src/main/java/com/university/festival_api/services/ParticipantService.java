package com.university.festival_api.services;

import org.springframework.stereotype.Service;

import com.university.festival_api.models.Criterion;
import com.university.festival_api.models.Participant;
import com.university.festival_api.models.Prize;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ParticipantService {
    private List<Participant> participants;
    private final XmlStorageService xmlStorageService;
     
    public ParticipantService(XmlStorageService xmlStorageService){
       this.xmlStorageService = xmlStorageService;
       List<Participant> loadedData = xmlStorageService.loadParticipant();
      
       this.participants = loadedData != null ? new ArrayList<>(loadedData) : new ArrayList<>();
    }

    public List<Participant> getAllParticipant(){
        return participants;
    }

    public Participant addParticipant(Participant participant){
        if(participant.getId()==null){
            participant.setId(java.util.UUID.randomUUID());
        }
        participants.add(participant);
        xmlStorageService.saveParticipants(participants);
        return participant;
    }

    public Participant evaluateParticipant(String participantId, int tourNumber, List<Criterion> criterion){
       int score=0;
       for(Criterion c:criterion){
        if(c.getReceivedScore()<0){
            throw new IllegalArgumentException("Оцінка за '" + c.getName() + "' не може бути від'ємною");
        }
        if(c.getReceivedScore()>c.getMaxScore()){
            throw new IllegalArgumentException("Оцінка за '" + c.getName() + "' не може перевищувати " + c.getMaxScore());
        }
        c.setTourNumber(tourNumber);
        score+= c.getReceivedScore();
       }
        for(Participant p : participants){
        
            if(p.getId() != null && p.getId().toString().equals(participantId)){
                int currentTotal=p.getTour1Score()+p.getTour2Score()+p.getTour3Score();
                int oldScore=0;
                if(tourNumber==1) oldScore=p.getTour1Score();
                else if(tourNumber==2) oldScore=p.getTour2Score();
                else if(tourNumber==3) oldScore=p.getTour3Score();
                if((currentTotal-oldScore+score)>100){
                    throw new IllegalArgumentException("Оцінка не має перевищувати 100 балів");
                }
                if(tourNumber == 1){
                    p.setTour1Score(score);
                } else if (tourNumber == 2){
                    p.setTour2Score(score);
                } else if (tourNumber == 3){
                    p.setTour3Score(score);
                } 
                if(p.getCriterion()==null){
                    p.setCriterion(new ArrayList<>());
                }
                p.getCriterion().removeIf(c->c.getTourNumber()==tourNumber);
                p.getCriterion().addAll(criterion);

                assignPrizeAutomaticaly(p);
                xmlStorageService.saveParticipants(participants);
                return p;
            }
        }
        throw new RuntimeException("Учасника з id " + participantId + " не знайдено");
    }

    public Participant updateParticipant(String id, Participant updateParticipant){
         for(Participant p : participants){
         
            if(p.getId() != null && p.getId().toString().equals(id)){
               p.setFirstName(updateParticipant.getFirstName());
               p.setLastName(updateParticipant.getLastName());
               p.setGroupName(updateParticipant.getGroupName());
               p.setPerformanceGenre(updateParticipant.getPerformanceGenre());
               
               p.setVenue(updateParticipant.getVenue());
               p.setProplist(updateParticipant.getProplist());
               p.setEquipments(updateParticipant.getEquipments());
               xmlStorageService.saveParticipants(participants);
               return p;
            }
         }
        return null;
    }

    public void deleteParticipant(String id){
      
       boolean isRemoveParticipant = participants.removeIf(p -> p.getId() != null && p.getId().toString().equals(id));

       if(isRemoveParticipant){
        xmlStorageService.saveParticipants(participants);
       } else {
        throw new RuntimeException("Учасника з ID " + id + " не знайдено");
       }
    }
    private void assignPrizeAutomaticaly(Participant participant){
        int totalScore=participant.getTour1Score()+participant.getTour2Score()+participant.getTour3Score();
        if(totalScore>=95){
            participant.setPrize(new Prize(UUID.randomUUID(),"Гран-прі", "Абсолютний переможець фестивалю"));
        }else if(totalScore>=85){
            participant.setPrize(new Prize(UUID.randomUUID(),"Лауреат I ступеня", "За високу виконавську майстерність"));
        }else if(totalScore>=75){
            participant.setPrize(new Prize(UUID.randomUUID(),"Лауреат II ступеня", "За яскравий та емоційний виступ"));
        }else if(totalScore>=60){
            participant.setPrize(new Prize(UUID.randomUUID(),"Дипломант", "За участь у фіналі фестивалю"));
        }else{
            participant.setPrize(null);
        }
    }
}