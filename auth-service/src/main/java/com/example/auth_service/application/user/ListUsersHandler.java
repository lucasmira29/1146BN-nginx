package com.example.auth_service.application.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.auth_service.domain.user.UserRepository;
import com.example.auth_service.interfaces.rest.dto.user.UserResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListUsersHandler {

    private final UserRepository userRepository;

    public List<UserResponse> handle() {
        return userRepository.findAll(Pageable.unpaged()).stream()
                .map(UserResponse::from) 
                .collect(Collectors.toList());
    }
}
