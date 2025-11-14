package com.example.auth_service.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.example.auth_service.application.ports.TokenService;
import com.example.auth_service.domain.user.User;
import com.example.auth_service.infrastructure.config.JwtProperties;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtTokenService implements TokenService {

    private final SecretKey key;
    private final long accessTtlMillis;
    private final long refreshTtlMillis;

    public JwtTokenService(JwtProperties jwtProperties) {

        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        this.accessTtlMillis = TimeUnit.SECONDS.toMillis(jwtProperties.getAccessTtlSeconds());
        this.refreshTtlMillis = TimeUnit.SECONDS.toMillis(jwtProperties.getRefreshTtlSeconds());
    }

    @Override
    public TokenPair issue(User user) {
        var nowMillis = System.currentTimeMillis();
        var now = new Date(nowMillis);

     
        var roles = List.of(user.getRole().getValue().name());

        // --- Access Token ---
        var accessExpiration = new Date(nowMillis + this.accessTtlMillis);
        var accessToken = Jwts.builder()
                .subject(user.getId().value().toString())
                .claim("name", user.getName())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(accessExpiration)
                .signWith(key)
                .compact();


        var refreshExpiration = new Date(nowMillis + this.refreshTtlMillis);
        var refreshToken = Jwts.builder()
                .subject(user.getId().value().toString())
                .issuedAt(now)
                .expiration(refreshExpiration)
                .signWith(key) 
                .compact();

        return new TokenPair(accessToken, refreshToken, this.accessTtlMillis);
    }
}