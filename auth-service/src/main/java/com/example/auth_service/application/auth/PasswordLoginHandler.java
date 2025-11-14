package com.example.auth_service.application.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.auth_service.application.ports.PasswordHasher;
import com.example.auth_service.application.ports.TokenService;
import com.example.auth_service.domain.user.UserRepository;
import com.example.auth_service.domain.user.vo.Email;
import com.example.auth_service.interfaces.rest.dto.auth.PasswordLoginRequest;
import com.example.auth_service.interfaces.rest.dto.auth.TokenResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordLoginHandler {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final TokenService tokenService;

    @Transactional(readOnly = true)
    public TokenResponse handle(PasswordLoginRequest request) {
        var email = new Email(request.email());
        
        var user = userRepository.findByEmail(email.value())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password: " + email.value()));

        if (!passwordHasher.match(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        var tokenPair = tokenService.issue(user);
        return new TokenResponse(
            tokenPair.token(), 
            tokenPair.refreshToken(), 
            tokenPair.expiresIn()
        );
    }
}