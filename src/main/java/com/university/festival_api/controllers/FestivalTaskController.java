package com.university.festival_api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
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

import com.university.festival_api.models.FestivalTask;
import com.university.festival_api.models.taskStatus;
import com.university.festival_api.services.FestivalTaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class FestivalTaskController {
    
    private final FestivalTaskService festivalTaskService;

    public FestivalTaskController(FestivalTaskService festivalTaskService){
        this.festivalTaskService=festivalTaskService;
    }

    @GetMapping
    public List<FestivalTask> getAllTasks(){
        return festivalTaskService.getAllTasks();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public FestivalTask addFestivalTask(@RequestBody FestivalTask task){
        return festivalTaskService.addFestivalTask(task);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}/status")
    public FestivalTask updateStatus(@PathVariable("id") String id,@RequestParam("status") taskStatus status){
        return festivalTaskService.updateFestivalTask(id, status);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}/assign")
    public FestivalTask assignHost(@PathVariable("id") String id,@RequestParam("hostId") UUID hostId ){
        return festivalTaskService.assignHost(id, hostId);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") String id) {
        festivalTaskService.deleteTask(id);
    }
}