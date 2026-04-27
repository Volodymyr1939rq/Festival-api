package com.university.festival_api.models;

import lombok.Data;

@Data
public class User {
    private String id;
    private String username;
    private String password;
    private Role role;
}
