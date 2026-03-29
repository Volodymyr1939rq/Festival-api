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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.university.festival_api.models.Criterion;
import com.university.festival_api.models.Participant;
import com.university.festival_api.services.ExcelReportService;
import com.university.festival_api.services.ParticipantService;


@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins="http://localhost:3000")
public class ParticipantController {
   private final ParticipantService participantService;
   private final ExcelReportService excelReportService;

   public ParticipantController(ParticipantService participantService,ExcelReportService excelReportService){
       this.participantService=participantService;
       this.excelReportService=excelReportService;
   }
    
    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipant();
    }
    @PostMapping
    public Participant addNewParticipants(@RequestBody Participant participant) {
        return participantService.addParticipant(participant);
    }
    @PutMapping("/{id}/evaluate")
    public ResponseEntity<?> evaluate(@PathVariable("id") String id,@RequestParam("tour") int tourNumber,@RequestBody List<Criterion> criterions){
        try {
            Participant evaluatedParticipant=participantService.evaluateParticipant(id, tourNumber, criterions);
            return ResponseEntity.ok(evaluatedParticipant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch(RuntimeException e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        
    }
    @GetMapping("/export/excel")
    public ResponseEntity<Resource> exportToExcel(){
      List<Participant> participants=participantService.getAllParticipant();
      excelReportService.createExcelFile(participants);

      byte[] excelBytes=excelReportService.createExcelFile(participants);
      Resource resource=new ByteArrayResource(excelBytes);
      
      return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=festival_report.xlsx")
      .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
      .contentLength(excelBytes.length)
      .body(resource);
    }

    @PutMapping("/{id}")
    public Participant updateParticipant(@PathVariable("id") String id,@RequestBody Participant updatedParticipant){
        return participantService.updateParticipant(id, updatedParticipant);
    }

    @DeleteMapping("/{id}")
    public void deleteParticipant(@PathVariable("id")String id){
        participantService.deleteParticipant(id);
    }
}
