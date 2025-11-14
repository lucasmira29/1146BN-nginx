package com.example.auth_service.interfaces.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth_service.application.user.ListUsersHandler;
import com.example.auth_service.application.user.RegisterUserHandler;
import com.example.auth_service.interfaces.rest.dto.user.UserRequest;
import com.example.auth_service.interfaces.rest.dto.user.UserResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/users")
@RequiredArgsConstructor
public class UserController {

    private final RegisterUserHandler registerUserHandler;
    private final ListUsersHandler listUsersHandler;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody UserRequest request 
    ) {
        var response = registerUserHandler.handle(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        var response = listUsersHandler.handle();
        return ResponseEntity.ok(response);
    }
}
