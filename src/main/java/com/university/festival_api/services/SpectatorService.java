package com.university.festival_api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.university.festival_api.models.Spectator;

@Service
public class SpectatorService {
    private List<Spectator> spectators;
    private final XmlStorageService xmlStorageService;

    public SpectatorService(XmlStorageService xmlStorageService){
        this.xmlStorageService=xmlStorageService;
        List<Spectator> loadData=xmlStorageService.loadSpectator();
        this.spectators=loadData!=null ? new ArrayList<>(loadData):new ArrayList<>();
    }

    public List<Spectator> getAllSpectators(){return spectators;}

    public Spectator addSpectator(Spectator spectator){
        if(spectator.getId()==null){
            spectator.setId(UUID.randomUUID());
        }
        spectators.add(spectator);
        xmlStorageService.saveSpectator(spectators);
        return spectator;
    }

    public void deleteSpectator(String id){
        spectators.removeIf(r->r.getId()!=null && r.getId().toString().equals(id));
        xmlStorageService.saveSpectator(spectators);
    }
}
