package com.university.festival_api.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.university.festival_api.models.User;
import com.university.festival_api.services.XmlStorageService;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final XmlStorageService xmlStorageService;

    public Optional<User> findByUserName(String username){
        return xmlStorageService.loadUsers().stream()
        .filter(user->user.getUsername().equals(username))
        .findFirst();
    }
}
