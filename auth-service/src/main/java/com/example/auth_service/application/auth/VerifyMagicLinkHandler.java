package com.example.auth_service.application.auth;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.auth_service.application.ports.TokenService;
import com.example.auth_service.domain.auth.MagicLink; 
import com.example.auth_service.domain.auth.MagicLinkRepository;
import com.example.auth_service.domain.user.UserRepository;
import com.example.auth_service.interfaces.rest.dto.auth.MagicLinkVerifyRequest;
import com.example.auth_service.interfaces.rest.dto.auth.TokenResponse;
import com.example.auth_service.support.Digests;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerifyMagicLinkHandler {

    private final MagicLinkRepository magicLinkRepository;
    private final UserRepository userRepository;
    private final TokenService tokenService;

    @Transactional
    public TokenResponse handle(MagicLinkVerifyRequest request) {
        var tokenHash = Digests.sha256(request.token());

        var link = magicLinkRepository.findValidByHash(tokenHash, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired magic link"));
        
        var user = userRepository.findById(link.getUserId().value())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        magicLinkRepository.delete(link); 

        var tokenPair = tokenService.issue(user);
        return new TokenResponse(
            tokenPair.token(), 
            tokenPair.refreshToken(), 
            tokenPair.expiresIn()
        );
    }
}