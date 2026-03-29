package com.university.festival_api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.university.festival_api.models.FestivalTask;
import com.university.festival_api.models.taskStatus;

@Service
public class FestivalTaskService {
    private List<FestivalTask> festivalTasks;
    private final XmlStorageService xmlStorageService;

    public FestivalTaskService(XmlStorageService xmlStorageService){
        this.xmlStorageService=xmlStorageService;
        List<FestivalTask> loadedData=xmlStorageService.loadTasks();
        this.festivalTasks=loadedData!=null ? new ArrayList<>(loadedData) : new ArrayList<>();
    }

    public List<FestivalTask> getAllTasks(){return festivalTasks;}

    public FestivalTask addFestivalTask(FestivalTask task){
        if(task.getId()==null) task.setId(UUID.randomUUID());
        if(task.getStatus()==null) task.setStatus(taskStatus.TODO);
        festivalTasks.add(task);
        xmlStorageService.saveTask(festivalTasks);
        return task;
    }
    public FestivalTask updateFestivalTask(String id,taskStatus newStatus){
        for(FestivalTask t:festivalTasks){
            if(t.getId()!=null && t.getId().toString().equals(id)){
                t.setStatus(newStatus);
                xmlStorageService.saveTask(festivalTasks);
                return t;
            };
        }
        return null;
    }
    public FestivalTask assignHost(String taskId,UUID hostId){
        for(FestivalTask f:festivalTasks){
            if(f.getId()!=null && f.getId().toString().equals(taskId)){
                f.setAssignedHostId(hostId);
                xmlStorageService.saveTask(festivalTasks);
                return f;
            }
        }
        return null;
    }
    public void deleteTask(String id){
       festivalTasks.removeIf(r->r.getId()!=null && r.getId().toString().equals(id));
       xmlStorageService.saveTask(festivalTasks);
    }
}
