package com.university.festival_api.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.festival_api.models.Spectator;
import com.university.festival_api.services.SpectatorService;

@RestController
@RequestMapping("/api/spectators")
@CrossOrigin(origins = "http://localhost:3000")
public class SpectatorController {
    private final SpectatorService spectatorService;

    public SpectatorController(SpectatorService spectatorService){this.spectatorService=spectatorService;}

    @GetMapping
    public List<Spectator> getAllSpectators(){return spectatorService.getAllSpectators();}

    @PostMapping
    public Spectator addSpectator(@RequestBody Spectator spectator){return spectatorService.addSpectator(spectator);}

    @DeleteMapping("/{id}")
    public void deleteSpectator(@PathVariable("id") String id){spectatorService.deleteSpectator(id);}
}
