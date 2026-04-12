package com.university.festival_api.services;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.university.festival_api.models.JuryMember;

@Service
public class JuryService {
    private List<JuryMember> juryMember;
    private final XmlStorageService xmlStorageService;
    
    public JuryService(XmlStorageService xmlStorageService){
        this.xmlStorageService=xmlStorageService;
        List<JuryMember> loadeData=xmlStorageService.loadJuryMembers();
        this.juryMember=loadeData !=null ? new ArrayList<>(loadeData) : new ArrayList<>();
    }
    public List<JuryMember> getAllJury(){
        return juryMember;
    }

    public JuryMember addJury(JuryMember member){
        
        if(juryMember.size()>=5){
            throw new RuntimeException("Максимальна кількість журі 7");
        }
        if(member.getId()==null){
            member.setId(UUID.randomUUID());
        }
        juryMember.add(member);
        xmlStorageService.savedJuryMember(juryMember);
        return member;
    }

    public void juryDelete(String id){
        juryMember.removeIf(r->r.getId()!=null && r.getId().toString().equals(id));
        xmlStorageService.savedJuryMember(juryMember);
    }

    public boolean isJuryReady(){
        return juryMember.size()>=3 && juryMember.size()<=5;
    }
}
