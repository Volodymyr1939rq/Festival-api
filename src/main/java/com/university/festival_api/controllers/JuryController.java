package com.university.festival_api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.festival_api.models.JuryMember;
import com.university.festival_api.services.JuryService;
import java.util.List;

@RestController
@RequestMapping("/api/jury")
@CrossOrigin(origins = "http://localhost:3000")
public class JuryController {
    
private final JuryService juryService;

public JuryController(JuryService juryService){
    this.juryService=juryService;
}
  @GetMapping
    public List<JuryMember> getAll(){
        return juryService.getAllJury();
    }
  @PostMapping
    public ResponseEntity<?> addNewJury(@RequestBody JuryMember member){
        try {
            JuryMember savedJuryMember=juryService.addJury(member);
            return ResponseEntity.ok(savedJuryMember);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    } 

    @DeleteMapping("/{id}")
    public void deleteJury(@PathVariable("id") String id){
        juryService.juryDelete(id);
    }

    @GetMapping("/ready")
    public boolean isJuryReady(){
       return juryService.isJuryReady();
    }
}
