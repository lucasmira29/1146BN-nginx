package com.example.auth_service.application.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.auth_service.application.ports.PasswordHasher;
import com.example.auth_service.domain.user.User;
import com.example.auth_service.domain.user.UserRepository;
import com.example.auth_service.domain.user.vo.Email;
import com.example.auth_service.domain.user.vo.Role;
import com.example.auth_service.domain.user.vo.RoleType;
import com.example.auth_service.interfaces.rest.dto.user.UserRequest;
import com.example.auth_service.interfaces.rest.dto.user.UserResponse;
import com.example.auth_service.messaging.events.UserCreatedEvent;
import com.example.auth_service.messaging.events.UserCreatedPublisher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterUserHandler {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final UserCreatedPublisher userCreatedPublisher;

    @Transactional
    public UserResponse handle(UserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        var hashedPassword = passwordHasher.hash(request.password());

  
        RoleType userRole;
        if (request.role() != null && !request.role().isBlank()) {
            try {

                userRole = RoleType.valueOf(request.role().toUpperCase());
            } catch (IllegalArgumentException e) {

                throw new IllegalArgumentException("Role inválido: " + request.role());
            }
        } else {
 
            userRole = RoleType.PACIENTE;
        }

        var user = User.create(
                request.name(),
                new Email(request.email()),
                hashedPassword,
                new Role(userRole),
                request.document(),
                request.birthdate(),
                request.phone(),
                request.postal_code()
        ); 

        user = userRepository.save(user);

        userCreatedPublisher.publish(new UserCreatedEvent(
            user.getId().value(),        
            user.getEmail().value(),     
            user.getName(),              
            user.getRole().getValue().name(),
            user.getDocument(),
            user.getBirthdate(),
            user.getPhone(),
            user.getPostal_code()
        ));

        return UserResponse.from(user);
    }
}
