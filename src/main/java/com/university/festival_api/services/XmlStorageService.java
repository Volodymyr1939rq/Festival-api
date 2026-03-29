package com.university.festival_api.services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.university.festival_api.models.FestivalTask;
import com.university.festival_api.models.Host;
import com.university.festival_api.models.JuryMember;
import com.university.festival_api.models.Participant;
import com.university.festival_api.models.Spectator;

@Service
public class XmlStorageService {
    private final String PARTICIPANT_FILE="participants.xml";
    private final String JURY_FILE="jurymember.xml";
    private final String HOST_FILE="host.xml";
    private final String TASK_FILE="task.xml";
    private final String SPECTATOR_FILE="spectator.xml";
    private XmlMapper mapper=new XmlMapper();

    public void saveParticipants(List<Participant> participants){
        try {
            mapper.writeValue(new File(PARTICIPANT_FILE),participants);
            System.out.println("Дані успішно збережено");
        } catch (IOException e) {
            System.out.println("Дані не було збережено" + e.getMessage());
        }
    }

    public List<Participant> loadParticipant(){
        File file=new File(PARTICIPANT_FILE);
        if(!file.exists()){
           return new ArrayList<>();
        }
        try {
            return mapper.readValue(file, new TypeReference<List<Participant>>() {});
        } catch (IOException e) {
            System.out.println("Помилка читання файлу" + e.getMessage());
            return new ArrayList<>();
        }
    }
    public List<JuryMember> loadJuryMembers(){
        File file=new File(JURY_FILE);
        if(!file.exists()){
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(file, new TypeReference<List<JuryMember>>() {});
        } catch (IOException e) {
             System.out.println("Помилка читання файлу" + e.getMessage());
             return new ArrayList<>();
        }
    }
    public void savedJuryMember(List<JuryMember> juryMembers){
        try {
            mapper.writeValue(new File(JURY_FILE),juryMembers);
            System.out.println("Дані успішно збережено");
        } catch (IOException e) {
            System.out.println("Дані не було збережено" + e.getMessage());
        }
    }
    public void saveHosts(List<Host> hosts){
        try {
            mapper.writeValue(new File(HOST_FILE), hosts);
            System.out.println("Файл успішно збережено");
        } catch (IOException e) {
            System.out.println("Дані не було збережено"+ e.getMessage());
        }
    }

    public List<Host> loadHosts(){
        File file=new File(HOST_FILE);
        if(!file.exists()){
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(file,new TypeReference<List<Host>>(){});
        } catch (IOException e) {
            System.out.println("Помилка читання файлу" + e.getMessage());
             return new ArrayList<>();
        }
    }
     public void saveTask(List<FestivalTask> tasks){
        try {
            mapper.writeValue(new File(TASK_FILE), tasks);
            System.out.println("Файл успішно збережено");
        } catch (IOException e) {
            System.out.println("Дані не було збережено"+ e.getMessage());
        }
    }
     public List<FestivalTask> loadTasks(){
        File file=new File(TASK_FILE);
        if(!file.exists()){
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(file,new TypeReference<List<FestivalTask>>(){});
        } catch (IOException e) {
            System.out.println("Помилка читання файлу" + e.getMessage());
             return new ArrayList<>();
        }
    }
     public void saveSpectator(List<Spectator> spectators){
        try {
            mapper.writeValue(new File(SPECTATOR_FILE), spectators);
            System.out.println("Файл успішно збережено");
        } catch (IOException e) {
           System.out.println("Дані не було збережено"+e.getMessage());
        }
     }
     public List<Spectator> loadSpectator(){
        File file=new File(SPECTATOR_FILE);
        if(!file.exists()){
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(file, new TypeReference<List<Spectator>>() {});
        } catch (IOException e) {
           System.out.println("Помилка читання файлу глядачів"+e.getMessage());
           return new ArrayList<>();
        }
     }
}
