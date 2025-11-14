package com.example.auth_service.interfaces.rest.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest (
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    
    String role, 
    
    @NotBlank String document,
    @NotBlank String birthdate,
    String phone,
    @NotBlank String postal_code
){
}