package com.university.festival_api.services;

import org.springframework.stereotype.Service;
import com.university.festival_api.dto.EurovisionVoteRequest;
import com.university.festival_api.dto.VoteEntry;
import com.university.festival_api.models.Criterion;
import com.university.festival_api.models.FestivalTask;
import com.university.festival_api.models.Participant;
import com.university.festival_api.models.Prize;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ParticipantService {
    private List<Participant> participants;
    private final XmlStorageService xmlStorageService;
    private final FestivalTaskService festivalTaskService;
    public ParticipantService(XmlStorageService xmlStorageService,FestivalTaskService festivalTaskService){
       this.xmlStorageService = xmlStorageService;
       this.festivalTaskService=festivalTaskService;
       List<Participant> loadedData = xmlStorageService.loadParticipant();
      
       this.participants = loadedData != null ? new ArrayList<>(loadedData) : new ArrayList<>();
    }

    public List<Participant> getAllParticipant(){
        List<Participant> freshData=xmlStorageService.loadParticipant();
        this.participants=freshData!=null ? new ArrayList<>(freshData):new ArrayList<>();
        return participants;
    }

    public Participant addParticipant(Participant participant){
        if(participant.getId()==null){
            participant.setId(java.util.UUID.randomUUID());
        }
        participants.add(participant);
        xmlStorageService.saveParticipants(participants);
        generateTaskForHost(participant);
        return participant;
    }

    public synchronized boolean submitEurovisionVotes(EurovisionVoteRequest request) {
    try {
        List<Participant> freshData = xmlStorageService.loadParticipant();
        this.participants = freshData != null ? new ArrayList<>(freshData) : new ArrayList<>();

        int tourNumber = request.getTourNumber();
        UUID juryId = request.getJuryId(); 
        String judgeName = request.getJudgeName();

        for (VoteEntry vote : request.getVotes()) {
           
            Participant p = participants.stream()
                    .filter(part -> part.getId() != null && part.getId().toString().equals(vote.getParticipantId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Учасника з ID " + vote.getParticipantId() + " не знайдено"));

            if (p.getCriterion() == null) {
                p.setCriterion(new ArrayList<>());
            }

            boolean alreadyRated = p.getCriterion().stream()
                    .anyMatch(c -> juryId.equals(c.getJuryId()) && c.getTourNumber() == tourNumber);
            
            if (alreadyRated) {
                throw new RuntimeException("Суддя " + judgeName + " вже поставив оцінку учаснику " + p.getFirstName());
            }

            boolean scoreAlreadyUsed = participants.stream()
                    .flatMap(part -> part.getCriterion() != null ? part.getCriterion().stream() : java.util.stream.Stream.empty())
                    .anyMatch(c -> juryId.equals(c.getJuryId()) && 
                                   c.getTourNumber() == tourNumber && 
                                   c.getReceivedScore() == vote.getScore());

            if (scoreAlreadyUsed) {
                throw new RuntimeException("Суддя " + judgeName + " вже віддав " + vote.getScore() + " балів іншому учаснику в " + tourNumber + " турі! ");
            }

            Criterion eurovisionVote = new Criterion();
            eurovisionVote.setJuryId(juryId); 
            eurovisionVote.setName(judgeName);
            eurovisionVote.setMaxScore(12);
            eurovisionVote.setReceivedScore(vote.getScore());
            eurovisionVote.setTourNumber(tourNumber);

            if (!eurovisionVote.isValidEuroVisionScore()) {
                throw new IllegalArgumentException("Недійсний бал Євробачення: " + vote.getScore());
            }

            p.getCriterion().add(eurovisionVote);

            if (tourNumber == 1) p.setTour1Score(p.getTour1Score() + vote.getScore());
            else if (tourNumber == 2) p.setTour2Score(p.getTour2Score() + vote.getScore());
            else if (tourNumber == 3) p.setTour3Score(p.getTour3Score() + vote.getScore());

            assignPrizeAutomaticaly(p);
        }
        
        xmlStorageService.saveParticipants(participants);
        return true;

    } catch (Exception e) {
        System.err.println("Помилка валідації: " + e.getMessage());
        throw e; 
    }
}
    public Participant updateParticipant(String id, Participant updateParticipant){
         for(Participant p : participants){
         
            if(p.getId() != null && p.getId().toString().equals(id)){
               p.setFirstName(updateParticipant.getFirstName());
               p.setLastName(updateParticipant.getLastName());
               p.setSongTitle(updateParticipant.getSongTitle());
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
       
        int finalScore = participant.getTour3Score();
        
        if(finalScore == 0){
            participant.setPrize(null);
            return;
        }

        if(finalScore >= 45){
            participant.setPrize(new Prize(UUID.randomUUID(),"Гран-прі", "Абсолютний переможець фестивалю"));
        }else if(finalScore >= 40){
            participant.setPrize(new Prize(UUID.randomUUID(),"Лауреат I ступеня", "За високу виконавську майстерність"));
        }else if(finalScore >= 30){
            participant.setPrize(new Prize(UUID.randomUUID(),"Лауреат II ступеня", "За яскравий та емоційний виступ"));
        }else if(finalScore >= 20){
            participant.setPrize(new Prize(UUID.randomUUID(),"Дипломант", "За участь у фіналі фестивалю"));
        }else{
            participant.setPrize(null);
        }
    }

public void addPublicVote(String participantId) {
        List<Participant> freshData=xmlStorageService.loadParticipant();
        this.participants=freshData!=null ? new ArrayList<>(freshData):new ArrayList<>();
        Participant participant = participants.stream()
                .filter(p -> p.getId() != null && p.getId().toString().equals(participantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Учасника не знайдено!"));

        
        if (participant.getPublicVote() == null) {
            participant.setPublicVote(0);
        }

        participant.setPublicVote(participant.getPublicVote() + 1);
        
        xmlStorageService.saveParticipants(participants); 
    }

    public List<Participant> getFinalResults() {
        List<Participant> results = getGrandFinalists();

        // 1. Сортуємо учасників за кількістю голосів публіки, щоб роздати бали Євробачення (12, 10, 8...)
        results.sort((p1, p2) ->{
            int vote1=(p1.getPublicVote()!=null) ? p1.getPublicVote():0;
            int vote2=(p2.getPublicVote()!=null) ? p2.getPublicVote():0;
            return Integer.compare(vote2, vote1);
        });

        int[] eurovisionPoints = {12, 10, 8, 7, 6, 5, 4, 3, 2, 1};

        for (int i = 0; i < results.size(); i++) {
            Participant p = results.get(i);
            int pointsToGive = 0;
        
            int currentPublicVote = (p.getPublicVote()!=null) ? p.getPublicVote() : 0;

            if(i < eurovisionPoints.length && currentPublicVote > 0){
                pointsToGive = eurovisionPoints[i];
            }
            
            double tour3Score = 0.0;
            if(p.getTour3Score() != null){
               tour3Score = p.getTour3Score().doubleValue();
            }

            double totalScore = tour3Score + pointsToGive;
            p.setFinalScore(totalScore); 
        }

        results.sort((p1, p2) -> {
            double score1 = (p1.getFinalScore() != null) ? p1.getFinalScore() : 0;
            double score2 = (p2.getFinalScore() != null) ? p2.getFinalScore() : 0;

            if (Double.compare(score2, score1) != 0) {
                return Double.compare(score2, score1);
            }
            
            int pub1 = (p1.getPublicVote() != null) ? p1.getPublicVote() : 0;
            int pub2 = (p2.getPublicVote() != null) ? p2.getPublicVote() : 0;
            
            return Integer.compare(pub2, pub1);
        });

        return results;
    }

public List<Participant> conductAllocationDraw(){
 List<Participant> participants=xmlStorageService.loadParticipant();
 Collections.shuffle(participants);

 int half=participants.size()/2;
 for(int i=0;i<participants.size();i++){
   if(i<half){
    participants.get(i).setAllocatedSemiFinal(1);
   }else{
    participants.get(i).setAllocatedSemiFinal(2);
   }
   System.out.println("Учасник: " + participants.get(i).getFirstName() + " -> Півфінал: " + participants.get(i).getAllocatedSemiFinal());
 }
 xmlStorageService.saveParticipants(participants);
 this.participants=participants;
 return participants;
}
public List<Participant> getGrandFinalists(){
    List<Participant> allParticipants=xmlStorageService.loadParticipant();

    List<Participant> sf1Top=allParticipants.stream()
    .filter(p->p.getAllocatedSemiFinal()!=null && p.getAllocatedSemiFinal()==1)
    .filter(p->p.getTour1Score()!=null && p.getTour1Score()>0)
    .sorted(Comparator.comparing(Participant::getTour1Score).reversed())
    .limit(5)
    .collect(Collectors.toList());

    List<Participant> sf2Top=allParticipants.stream()
    .filter(p->p.getAllocatedSemiFinal()!=null && p.getAllocatedSemiFinal()==2)
    .filter(p->p.getTour2Score()!=null && p.getTour2Score()>0)
    .sorted(Comparator.comparing(Participant::getTour2Score).reversed())
    .limit(5)
    .collect(Collectors.toList());

    List<Participant> grandFinal=new ArrayList<>();
    grandFinal.addAll(sf1Top);
    grandFinal.addAll(sf2Top);
    return grandFinal;
}
private void generateTaskForHost(Participant p){
    FestivalTask hostTask=new FestivalTask();
    hostTask.setTitle("Оголосити: " + p.getFirstName() + " " + p.getLastName());
    StringBuilder script=new StringBuilder();
    script.append("Країна: ").append(p.getCountry()!=null ? p.getCountry():"Не вказана").append(".\n");
    script.append("На сцені: ").append(p.getFirstName()).append(" ").append(p.getLastName()).append("!\n");
    script.append("Пісня: ").append(p.getSongTitle()).append("\".");

    if (p.getProplist() != null && !p.getProplist().isEmpty()) {
        script.append("\n\n(Увага: техніки виносять реквізит, зробіть паузу на 15 секунд)");
    }

    hostTask.setDescription(script.toString());
    hostTask.setTourNumber(1);

    festivalTaskService.addFestivalTask(hostTask);
}
}