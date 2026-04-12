package com.university.festival_api.controllers;

import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.festival_api.dto.EurovisionVoteRequest; 
import com.university.festival_api.models.Participant;
import com.university.festival_api.services.ExcelReportService;
import com.university.festival_api.services.ParticipantService;


@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins="http://localhost:3000")
public class ParticipantController {
   private final ParticipantService participantService;
   private final ExcelReportService excelReportService;

   public ParticipantController(ParticipantService participantService, ExcelReportService excelReportService){
       this.participantService = participantService;
       this.excelReportService = excelReportService;
   }
    
    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipant();
    }

    @PostMapping
    public Participant addNewParticipants(@RequestBody Participant participant) {
        return participantService.addParticipant(participant);
    }

   @PostMapping("/eurovision-evaluate")
public ResponseEntity<?> evaluateEurovisionTour(@RequestBody EurovisionVoteRequest request) {
    try {
    
        if (request.getJuryId() == null) {
            return ResponseEntity.badRequest()
                .body("{\"success\": false, \"error\": \"ID судді обов'язкове (juryId is null)\"}");
        }

        boolean success = participantService.submitEurovisionVotes(request);
        
        if (success) {
            return ResponseEntity.ok()
                .body("{\"success\": true, \"message\": \"Голоси успішно збережено.\"}");
        } else {
            return ResponseEntity.status(500)
                .body("{\"success\": false, \"message\": \"Помилка при збереженні даних у файл.\"}");
        }

    } catch (IllegalArgumentException e) {
 
        return ResponseEntity.badRequest()
            .body("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
            
    } catch (RuntimeException e) {
   
        return ResponseEntity.status(409)
            .body("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
            
    } catch (Exception e) {
     
        return ResponseEntity.internalServerError()
            .body("{\"success\": false, \"error\": \"Внутрішня помилка сервера\"}");
    }
}

    @GetMapping("/export/excel")
    public ResponseEntity<Resource> exportToExcel(){
      List<Participant> participants = participantService.getAllParticipant();
      
      byte[] excelBytes = excelReportService.createExcelFile(participants);
      Resource resource = new ByteArrayResource(excelBytes);
      
      return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=festival_report.xlsx")
      .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
      .contentLength(excelBytes.length)
      .body(resource);
    }

    @PutMapping("/{id}")
    public Participant updateParticipant(@PathVariable("id") String id, @RequestBody Participant updatedParticipant){
        return participantService.updateParticipant(id, updatedParticipant);
    }

    @DeleteMapping("/{id}")
    public void deleteParticipant(@PathVariable("id") String id){
        participantService.deleteParticipant(id);
    }

    @PostMapping("/{id}/public-vote")
    public void addPublicVote(@PathVariable("id") String id){
        participantService.addPublicVote(id);
    }

    @GetMapping("/final-results")
    public ResponseEntity<List<Participant>> getFinalResults(){
        try {
            List<Participant> result=participantService.getFinalResults();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
           return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping("/draw")
    public ResponseEntity<List<Participant>> conductDraw() {
        try {
            List<Participant> updatedParticipants = participantService.conductAllocationDraw();
            return ResponseEntity.ok(updatedParticipants);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/finalists")
    public ResponseEntity<List<Participant>> getFinalists(){
        try {
            List<Participant> finalists=participantService.getGrandFinalists();
            return ResponseEntity.ok(finalists);
        } catch (Exception e) {
           return ResponseEntity.internalServerError().build();
        }
    }
}