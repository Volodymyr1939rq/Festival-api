package com.university.festival_api.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize; 
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.festival_api.models.Host;
import com.university.festival_api.services.HostService;

@RestController
@RequestMapping("/api/hosts")
@CrossOrigin(origins = "http://localhost:3000")
public class HostController {
    
    private final HostService hostService;

    public HostController(HostService hostService){
        this.hostService=hostService;
    }

    @GetMapping
    public List<Host> getAllHosts(){
        return hostService.getAllHosts();
    }
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public Host addHost(@RequestBody Host host){
        return hostService.addHost(host);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteHost(@PathVariable("id") String id){
        hostService.deleteHost(id);
    }
}