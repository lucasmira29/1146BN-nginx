package com.example.auth_service.interfaces.rest.dto.user;

import java.util.UUID;
import com.example.auth_service.domain.user.User;

public record UserResponse(UUID id, String name, String email, String role) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId().value(),         
                user.getName(),               
                user.getEmail().value(),      
                user.getRole().getValue().name() 
        );
    }
}