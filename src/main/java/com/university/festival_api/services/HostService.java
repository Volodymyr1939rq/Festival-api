package com.university.festival_api.services;
import com.university.festival_api.models.Host;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class HostService {
    private List<Host> hosts;
    private final XmlStorageService xmlStorageService;

    public HostService(XmlStorageService xmlStorageService){
      this.xmlStorageService=xmlStorageService;
      List<Host> loadedData=xmlStorageService.loadHosts();
      this.hosts=loadedData !=null ? new ArrayList<>(loadedData):new ArrayList<>();
    }
    public List<Host> getAllHosts(){
        return hosts;
    }

    public Host addHost(Host host){
      if(host.getId()==null) host.setId(UUID.randomUUID());
      hosts.add(host);
      xmlStorageService.saveHosts(hosts);
      return host;
    }
    public void deleteHost(String id){
        hosts.removeIf(r->r.getId()!=null && r.getId().toString().equals(id));
        xmlStorageService.saveHosts(hosts);
    }
}
