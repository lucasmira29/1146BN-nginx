package com.example.auth_service.interfaces.rest;

import com.example.auth_service.application.auth.PasswordLoginHandler;
import com.example.auth_service.application.auth.RequestMagicLinkHandler;
import com.example.auth_service.application.auth.VerifyMagicLinkHandler;
import com.example.auth_service.interfaces.rest.dto.auth.MagicLinkRequest;
import com.example.auth_service.interfaces.rest.dto.auth.MagicLinkVerifyRequest;
import com.example.auth_service.interfaces.rest.dto.auth.PasswordLoginRequest;
import com.example.auth_service.interfaces.rest.dto.auth.TokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final PasswordLoginHandler passwordLoginHandler;
    private final RequestMagicLinkHandler requestMagicLinkHandler;
    private final VerifyMagicLinkHandler verifyMagicLinkHandler;

    @PostMapping("/login/password")
    public ResponseEntity<TokenResponse> loginWithPassword(@Valid @RequestBody PasswordLoginRequest request) {
        TokenResponse token = passwordLoginHandler.handle(request);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/login/magic")
    public ResponseEntity<Void> requestMagic(@Valid @RequestBody MagicLinkRequest req) {
        requestMagicLinkHandler.handle(req);

        return ResponseEntity.accepted().build();
    }

    @PostMapping("login/magic/verify")
    public ResponseEntity<TokenResponse> verifyMagic(@Valid @RequestBody MagicLinkVerifyRequest request) {
        TokenResponse tokenResponse = verifyMagicLinkHandler.handle(request);

        return ResponseEntity.ok(tokenResponse);
    }
}